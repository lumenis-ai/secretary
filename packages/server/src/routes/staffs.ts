import type { UIMessage } from 'ai'
import { convertToModelMessages } from 'ai'
import { Hono } from 'hono'
import { modelManager } from '@/agents/model-manager'

export const staffsRoute = new Hono()

staffsRoute.post(`/${modelManager.id}`, async (c) => {
  const { messages } = await c.req.json<{
    messages: UIMessage[]
  }>()

  const result = await modelManager.stream({
    messages: await convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
})
