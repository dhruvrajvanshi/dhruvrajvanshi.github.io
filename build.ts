#!/usr/bin/env node
import { readdir, readFile, mkdir, writeFile, cp } from 'node:fs/promises'
import assert from 'node:assert/strict'
import * as Marked from 'marked'
import Path from 'node:path'
import Mustache from 'mustache'

const OUT_DIR = './dist'
async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  await cp('./assets', Path.resolve(OUT_DIR, 'assets'), { recursive: true })

  const layout = await readFile('./routes/layout.html', 'utf8')

  for (const file of await readdir('./routes')) {
    if (file === 'layout.html') continue
    assert(file.endsWith('.md'), `Unexpected file: ${file}`)
    const text = await readFile(Path.resolve('routes', file), 'utf8')
    const [frontmatter, remaining] = parseFrontmatter(text)
    if (frontmatter.disabled) continue
    const routeName = file.replace(/\.md$/, '')
    const outPath = Path.resolve(OUT_DIR, routeName + '.html')

    assert(!frontmatter.content)
    const outText = Mustache.render(layout, {
      ...frontmatter,
      content: Marked.parse(remaining),
    })
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
