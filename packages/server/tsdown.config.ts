import path from 'node:path'
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts'],
  format: 'esm',
  external: () => false,
  noExternal: () => true,
  alias: {
    '@': path.resolve(import.meta.dirname, './src'),
  },
})
