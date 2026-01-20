import { generateId } from 'ai'
import { useRef } from 'react'

export function useConversationId() {
  const conversationId = useRef<string>(undefined)

  if (!conversationId.current) {
    conversationId.current = generateId()
  }

  return {
    conversationId,
  }
}
