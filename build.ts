#!/usr/bin/env node
import {
  readdir,
  readFile,
  mkdir,
  writeFile,
  cp,
  open,
  type FileHandle,
} from 'node:fs/promises'
import assert from 'node:assert/strict'
import * as Marked from 'marked'
import Path from 'node:path'
import Mustache from 'mustache'
import { parseArgs } from 'node:util'
import { existsSync } from 'node:fs'

const OUT_DIR = './dist'
const { values: args } = parseArgs({
  options: {
    includeDrafts: { type: 'boolean', default: false },
  },
})

const BASE_URL = 'https://www.rajv.dev'
async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  console.log('Building', args)

  await cp('./assets', Path.resolve(OUT_DIR, 'assets'), { recursive: true })

  const routes = await collectRoutes('./routes')
  const helperData = await runHelpers(routes)
  for (const route of routes) {
    await generateRoute(helperData, route)
  }

  await generateSitemap(routes)
}

interface Route {
  templatePath: string
  layoutPath: string
  urlPath: `/${string}`
}
async function collectRoutes(baseDir: string): Promise<Route[]> {
  const resultRoutes: Omit<Route, 'urlPath'>[] = []
  const layoutStack: string[] = []
  await visit(baseDir)
  return resultRoutes.map((route) => ({
    templatePath: route.templatePath,
    layoutPath: route.layoutPath,
    urlPath: `/${Path.relative(baseDir, route.templatePath.replace(/\.md$/, ''))}`,
  }))

  function layoutPath() {
    const layout = layoutStack.at(-1)
    if (!layout) throw new Error('No layout found')
    return layout
  }

  async function visit(path: string) {
    const file = await open(path)
    const stat = await file.stat()
    if (stat.isDirectory()) {
      await visitDir(path)
    } else {
      await visitFile(path, file)
    }
  }
  async function visitDir(path: string) {
    const entries = await readdir(path)

    const layout = entries.find((e) => e === 'layout.html')
    if (layout) {
      layoutStack.push(Path.join(path, layout))
    }

    for (const entry of entries) {
      await visit(Path.resolve(path, entry))
    }
  }
  async function visitFile(path: string, file: FileHandle) {
    if (path.endsWith('layout.html')) return
    if (path.endsWith('.md')) {
      resultRoutes.push({
        templatePath: path,
        layoutPath: layoutPath(),
      })
    }
  }
}

async function runHelpers(routes: Route[]) {
  let helperData: Record<string, unknown> = {}
  if (existsSync('./template_helpers.ts')) {
    const helpers = await import('./template_helpers.ts')
    const routesWithFrontmatter = await Promise.all(
      routes.map(async (route) => {
        const templateText = await readFile(route.templatePath, 'utf8')
        const [frontmatter] = parseFrontmatter(templateText)
        return {
          ...route,
          frontmatter,
        }
      }),
    )
    for (const [name, fn] of Object.entries(helpers)) {
      assert(typeof fn === 'function', `Helper ${name} is not a function`)
      console.log(`Generating helperData.${name}...`)
      helperData[name] = fn({ routes: routesWithFrontmatter })
    }
  }
  return helperData
}

async function generateRoute(
  helperData: Record<string, unknown>,
  route: Route,
) {
  assert(
    route.templatePath.endsWith('.md'),
    `Unexpected template: ${route.templatePath}`,
  )
  const templateText = await readFile(route.templatePath, 'utf8')
  const [frontmatter, remaining] = parseFrontmatter(templateText)
  if (!args.includeDrafts && frontmatter.draft) return
  await mkdir(Path.dirname(Path.join(OUT_DIR, route.urlPath)), {
    recursive: true,
  })
  const outPath = Path.join(OUT_DIR, route.urlPath + '.html')

  assert(!frontmatter.content)
  const tokens = Marked.lexer(remaining)
  const title = frontmatter.title ?? extractHeading(tokens)
  const { titleTokens, bodyTokens } = splitContentAndBody(tokens)
  const layout = await readFile(route.layoutPath, 'utf8')
  const outText = Mustache.render(layout, {
    ...frontmatter,
    frontmatter,
    title,
    content: Marked.Parser.parse(tokens),
    content_title: titleTokens.length
      ? Marked.Parser.parse(titleTokens)
      : undefined,
    content_body: Marked.Parser.parse(bodyTokens),
    helperData,
  })
  await writeFile(outPath, outText, 'utf8')
}

async function generateSitemap(routes: Route[]) {
  const urls = routes.map(({ urlPath: name }) => {
    const path = name === '/index' ? '/' : `${name}.html`
    return `  <url><loc>${BASE_URL}${path}</loc></url>`
  })
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
  await writeFile(Path.resolve(OUT_DIR, 'sitemap.xml'), xml, 'utf8')
}
function extractHeading(tokens: Marked.TokensList): string | undefined {
  for (const token of tokens) {
    if (token.type === 'heading') return token.text
  }
}

function splitContentAndBody(tokens: Marked.TokensList): {
  titleTokens: Marked.TokensList
  bodyTokens: Marked.TokensList
} {
  const firstHeading = tokens.findIndex((t) => t.type === 'heading')
  if (firstHeading === -1) {
    return {
      titleTokens: Object.assign([], {
        links: tokens.links,
      }),
      bodyTokens: tokens,
    }
  }
  const titleTokens = Object.assign([tokens[firstHeading]], {
    links: tokens.links,
  })
  const bodyTokens = Object.assign(
    tokens.slice(0, firstHeading).concat(tokens.slice(firstHeading + 1)),
    { links: tokens.links },
  )
  return { titleTokens, bodyTokens }
}

interface Frontmatter {
  title: string
  published_on?: string
  draft?: boolean
  [key: string]: unknown
}
function parseFrontmatter(text: string): [Frontmatter, string] {
  if (!text.startsWith('---\n')) {
    const tokens = Marked.lexer(text)

    const frontmatter: Frontmatter = {
      title: extractHeading(tokens) ?? '',
    }
    return [frontmatter, text]
  }
  const [_, frontmatterText, ...remainingArr] = text.split('---\n')
  const remaining = remainingArr.join('---\n')
  const frontmatter = JSON.parse(frontmatterText)
  if (frontmatter.published_on) {
    const date = new Date(frontmatter.published_on)
    frontmatter.published_on = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
  if (!frontmatter.title) {
    const tokens = Marked.lexer(remaining)
    frontmatter.title = extractHeading(tokens) ?? ''
  }
  return [frontmatter, remaining]
}

await main()
