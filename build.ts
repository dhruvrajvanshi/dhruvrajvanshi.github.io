#!/usr/bin/env node
import { readdir, readFile, mkdir, cp, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { parse } from 'marked'
import Path from 'node:path'
import { existsSync } from 'node:fs'

const OUT_DIR = './dist'
async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  for (const file of await readdir('./routes')) {
    assert(file.endsWith('.md') || file.endsWith('.css'))
    if (file.endsWith('.css')) {
      cp(Path.resolve('routes', file), Path.resolve(OUT_DIR, file))
      continue
    }
    const text = await readFile(Path.resolve('routes', file), 'utf8')
    const [frontmatter, remaining] = parseFrontmatter(text)
    const parsed = parse(remaining)
    const routeName = file.replace(/\.md$/, '')
    const hasCSS = existsSync(Path.resolve('./routes', routeName + '.css'))
    const outPath = Path.resolve(OUT_DIR, routeName + '.html')
    const cssLink = hasCSS
      ? `<link rel="stylesheet" href="/${routeName}.css">`
      : ''
    const outText = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <base href="/">
    ${frontmatter.title ? `<title>${frontmatter.title}</title>` : ''}
    ${cssLink}
</head>
<body>
<main>
${parsed}
</main>
</body>
</html>
`
    await writeFile(outPath, outText, 'utf8')
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
