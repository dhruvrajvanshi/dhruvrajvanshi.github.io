#!/usr/bin/env node
import { readdir, readFile, mkdir, writeFile, cp } from 'node:fs/promises'
import assert from 'node:assert/strict'
import * as Marked from 'marked'
import Path from 'node:path'
import Mustache from 'mustache'
import { parseArgs } from 'node:util'

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

  const layout = await readFile('./routes/layout.html', 'utf8')
  const routeNames: string[] = []

  for (const file of await readdir('./routes')) {
    if (file === 'layout.html') continue
    assert(file.endsWith('.md'), `Unexpected file: ${file}`)
    const text = await readFile(Path.resolve('routes', file), 'utf8')
    const [frontmatter, remaining] = parseFrontmatter(text)
    if (!args.includeDrafts && frontmatter.draft) continue
    const routeName = file.replace(/\.md$/, '')
    routeNames.push(routeName)
    const outPath = Path.resolve(OUT_DIR, routeName + '.html')

    assert(!frontmatter.content)
    const tokens = Marked.lexer(remaining)
    const title = frontmatter.title ?? extractHeading(tokens)
    const outText = Mustache.render(layout, {
      ...frontmatter,
      title,
      content: Marked.Parser.parse(tokens),
    })
    await writeFile(outPath, outText, 'utf8')
  }

  await generateSitemap(routeNames)
}

async function generateSitemap(routeNames: string[]) {
  const urls = routeNames.map((name) => {
    const path = name === 'index' ? '/' : `/${name}.html`
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

function parseFrontmatter(text: string): [Record<string, string>, string] {
  const frontmatter: Record<string, string> = {}
  if (!text.startsWith('---\n')) {
    return [frontmatter, text]
  }
  const [_, frontmatterText, ...remaining] = text.split('---\n')
  return [JSON.parse(frontmatterText), remaining.join('---\n')]
}

await main()
