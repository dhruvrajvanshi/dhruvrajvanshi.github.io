#!/usr/bin/env node
import { spawn, spawnSync } from 'node:child_process'
import { watch } from 'node:fs/promises'
import { kill } from 'node:process'

const OUT_DIR = './dist'
const ROUTES_DIR = './routes'
const ASSETS_DIR = './assets'
async function main() {
  const server = spawn('npx', ['http-server', OUT_DIR, '-p', '3000'], {
    stdio: 'inherit',
  })
  console.log(`Server started on http://localhost:3000`)
  try {
    await rebuild()
    await Promise.all([
      (async () => {
        for await (const _event of watch(ROUTES_DIR, { recursive: true })) {
          console.log(`Routes changed; Rebuilding...`)
          await rebuild()
        }
      })(),
      (async () => {
        for await (const _event of watch(ASSETS_DIR, { recursive: true })) {
          console.log(`Assets changed; Rebuilding...`)
          await rebuild()
        }
      })(),
      (async () => {
        for await (const _event of watch('template_helpers.ts', {
          recursive: true,
        })) {
          console.log(`Helpers changed; Rebuilding...`)
          await rebuild()
        }
      })(),
      (async () => {
        for await (const _event of watch('build.ts', {
          recursive: true,
        })) {
          console.log(`build script changed; Rebuilding...`)
          await rebuild()
        }
      })(),
    ])
  } finally {
    if (server.pid) {
      kill(server.pid)
    }
  }
}

async function rebuild() {
  spawnSync('./build.ts', ['--includeDrafts'], {
    stdio: 'inherit',
  })
}
await main()
