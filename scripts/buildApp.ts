#!/usr/bin/env zx

import { renameSync } from 'node:fs'
import { platform } from 'node:os'
import { consola } from 'consola'
import { $ } from 'zx'

consola.start('Building assistant app...\n')

consola.start('Build server binary...')
await $`pnpm --filter assistant-server build`
const ext = platform() === 'win32' ? '.exe' : ''
const rustInfo = await $`rustc -vV`.text()
const targetTriple = /host: (\S+)/.exec(rustInfo)![1]
renameSync(
  `packages/server/dist/server${ext}`,
  `packages/app/src-tauri/binaries/server-${targetTriple}${ext}`,
)
consola.success('Server binary built\n')

consola.start('Build app...')
await $`pnpm --filter assistant-app build`
consola.success('App built\n')

consola.success('Assistant app built')
