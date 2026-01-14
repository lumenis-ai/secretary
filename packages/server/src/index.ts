import process from 'node:process'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { staffsRoute } from '@/routes/staffs'

const app = new Hono()

app.use(cors())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/staffs', staffsRoute)

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
