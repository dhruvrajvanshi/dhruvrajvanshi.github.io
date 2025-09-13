#!/usr/bin/env node
import { spawn, spawnSync } from 'node:child_process'
import { watch } from 'node:fs/promises'
import { kill } from 'node:process'

const OUT_DIR = './dist'
const ROUTES_DIR = './routes'
async function main() {
  const server = spawn('npx', ['http-server', OUT_DIR, '-p', '3000'], {
    stdio: 'inherit',
  })
  console.log(`Server started on http://localhost:3000`)
  try {
    await rebuild()
    for await (const _event of watch(ROUTES_DIR, { recursive: true })) {
      console.log(`Change detected; Rebuilding...`)
      await rebuild()
    }
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
