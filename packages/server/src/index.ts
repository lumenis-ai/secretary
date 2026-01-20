import type { HonoBindings, HonoVariables } from '@mastra/hono'
import process from 'node:process'
import { serve } from '@hono/node-server'
import {
  MastraServer,
} from '@mastra/hono'
import { Hono } from 'hono'
import { mastra } from '@/mastra'

const app = new Hono<({ Bindings: HonoBindings, Variables: HonoVariables })>()

const masterServer = new MastraServer({
  app,
  mastra,
})
// eslint-disable-next-line antfu/no-top-level-await
await masterServer.init()

const server = serve({
  fetch: app.fetch,
  port: process.env.PORT ? Number.parseInt(process.env.PORT) : 0,
}, (info) => {
  // eslint-disable-next-line no-console
  console.info(`PORT=${info.port}`)
})

process.on('SIGINT', () => {
  server.close()
  process.exit(0)
})
process.on('SIGTERM', () => {
  server.close((err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    process.exit(0)
  })
})
