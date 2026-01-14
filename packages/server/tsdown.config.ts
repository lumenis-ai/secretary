import path from 'node:path'
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts'],
  format: 'cjs',
  noExternal: ['@hono/node-server', 'hono'],
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
})
