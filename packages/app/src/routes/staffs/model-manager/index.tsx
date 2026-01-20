import type { FileUIPart, TextUIPart, ToolUIPart } from 'ai'
import type { PromptInputMessage } from '@/components/ai-elements/prompt-input'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from 'ai'
import {
  Confirmation,
  ConfirmationAccepted,
  ConfirmationAction,
  ConfirmationActions,
  ConfirmationRejected,
  ConfirmationRequest,
  ConfirmationTitle,
} from '@/components/ai-elements/confirmation'
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation'
import { Loader } from '@/components/ai-elements/loader'
import {
  Message,
  MessageAttachment,
  MessageAttachments,
  MessageContent,
  MessageResponse,
} from '@/components/ai-elements/message'
import { PromptInput, PromptInputActionAddAttachments, PromptInputActionMenu, PromptInputActionMenuContent, PromptInputActionMenuTrigger, PromptInputAttachment, PromptInputAttachments, PromptInputBody, PromptInputFooter, PromptInputHeader, PromptInputProvider, PromptInputSubmit, PromptInputTextarea } from '@/components/ai-elements/prompt-input'
import { Reasoning, ReasoningContent, ReasoningTrigger } from '@/components/ai-elements/reasoning'
import { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput } from '@/components/ai-elements/tool'
import { useConversationId } from '@/hooks/use-conversation-id'
import { useServer } from '@/hooks/use-server'

export default function ModelManager() {
  const { serverBaseUrl } = useServer()
  const { conversationId } = useConversationId()

  const { messages, sendMessage, status, error, addToolApprovalResponse } = useChat({
    id: conversationId.current,
    transport: new DefaultChatTransport({
      api: `${serverBaseUrl}/staffs/model-manager`,
    }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
  })

  const handleSubmit = (message: PromptInputMessage) => {
    const parts: Array<TextUIPart | FileUIPart> = [
      {
        type: 'text',
        text: message.text,
      },
    ]

    // Handle files if present
    if (message.files && message.files.length > 0) {
      parts.push(...message.files)
    }

    sendMessage({
      role: 'user',
      parts,
    })
  }

  const isLoading = status === 'submitted'

  return (
    <div className="flex flex-col h-full w-full bg-linear-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Model Manager</h1>
          <p className="text-sm text-muted-foreground truncate">The model manager is familiar with the configuration of various models, including local Ollama and common LLM Gateways.</p>
        </div>
        {messages.length > 0 && (
          <div className="text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
            {messages.length}
            {' '}
            messages
          </div>
        )}
      </div>

      {/* Messages Area */}
      <Conversation className="flex-1 px-4 py-6">
        <ConversationContent className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {
              messages.length
                ? messages.map((message, index) => {
                    const fileParts = message.parts.filter(
                      part => part.type === 'file',
                    ) as FileUIPart[]

                    const isLastMessage = index === messages.length - 1

                    return (
                      <Message
                        key={message.id}
                        from={message.role}
                        className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
                      >
                        <MessageContent>
                          {
                            message.parts.map((part, i) => {
                              if (part.type === 'text') {
                                return <MessageResponse key={`${message.id}-${i}`}>{part.text}</MessageResponse>
                              }
                              else if (part.type === 'reasoning') {
                                return (
                                  <Reasoning key={`${message.id}-${i}`} isStreaming={isLastMessage && part.state === 'streaming'} defaultOpen={true}>
                                    <ReasoningTrigger />
                                    <ReasoningContent>{part.text}</ReasoningContent>
                                  </Reasoning>
                                )
                              }
                              else if (part.type.startsWith('tool-')) {
                                const toolPart = part as ToolUIPart

                                return (
                                  <Tool key={`${message.id}-${i}`}>
                                    <ToolHeader title={toolPart.title} type={toolPart.type} state={toolPart.state} />
                                    <ToolContent>
                                      {!!toolPart.input && <ToolInput input={toolPart.input} />}
                                      {!!toolPart.output && <ToolOutput output={toolPart.output} errorText={toolPart.errorText} />}
                                      {!!toolPart.approval && (
                                        <Confirmation approval={toolPart.approval} state={toolPart.state}>
                                          <ConfirmationRequest>
                                            <ConfirmationTitle>
                                              Allow execution of this tool call?
                                            </ConfirmationTitle>
                                            <ConfirmationActions>
                                              <ConfirmationAction
                                                variant="outline"
                                                onClick={() => {
                                                  addToolApprovalResponse({
                                                    id: toolPart.toolCallId,
                                                    approved: false,
                                                    reason: 'Rejected',
                                                  })
                                                }}
                                              >
                                                Reject
                                              </ConfirmationAction>
                                              <ConfirmationAction onClick={() => {
                                                addToolApprovalResponse({
                                                  id: toolPart.toolCallId,
                                                  approved: true,
                                                })
                                              }}
                                              >
                                                Allow
                                              </ConfirmationAction>
                                            </ConfirmationActions>
                                          </ConfirmationRequest>
                                          <ConfirmationAccepted>
                                            <ConfirmationTitle>
                                              Tool call approved
                                            </ConfirmationTitle>
                                          </ConfirmationAccepted>
                                          <ConfirmationRejected>
                                            <ConfirmationTitle>
                                              Tool call rejected
                                            </ConfirmationTitle>
                                          </ConfirmationRejected>
                                          {(!!toolPart.output || !!toolPart.errorText) && (
                                            <ToolOutput output={toolPart.output} errorText={toolPart.errorText} />
                                          )}
                                        </Confirmation>
                                      )}
                                    </ToolContent>
                                  </Tool>
                                )
                              }

                              return null
                            })
                          }

                          {fileParts.length > 0 && (
                            <MessageAttachments>
                              {fileParts.map(part => (
                                <MessageAttachment
                                  key={`${message.id}-${part.type}`}
                                  data={part}
                                />
                              ))}
                            </MessageAttachments>
                          )}
                        </MessageContent>
                      </Message>
                    )
                  })
                : <ConversationEmptyState />
            }

            {/* Show loading indicator when streaming */}
            {isLoading && (
              <Message
                from="assistant"
                className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
              >
                <MessageContent>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Loader />
                    <span className="text-sm">think...</span>
                  </div>
                </MessageContent>
              </Message>
            )}
          </div>

          {/* Show error message if there's an error */}
          {error && (
            <div className="mt-6 mx-auto max-w-2xl rounded-xl border-2 border-destructive/30 bg-destructive/5 p-5 text-destructive shadow-lg shadow-destructive/5 animate-in fade-in-0 slide-in-from-top-4 duration-500">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center mt-0.5">
                  <span className="text-xs">!</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">发生错误</p>
                  <p className="mt-1.5 text-sm opacity-90 leading-relaxed">
                    {error.message || '无法连接到服务器，请检查服务器是否正在运行'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="bg-background/80 backdrop-blur-sm px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <PromptInputProvider>
            <PromptInput multiple globalDrop onSubmit={handleSubmit}>
              <PromptInputHeader>
                <PromptInputAttachments>
                  {attachment => (
                    <PromptInputAttachment key={attachment.id} data={attachment} />
                  )}
                </PromptInputAttachments>
              </PromptInputHeader>
              <PromptInputBody>
                <PromptInputTextarea
                  placeholder="Issue instructions"
                  className="min-h-[60px]"
                />
              </PromptInputBody>
              <PromptInputFooter>
                <PromptInputActionMenu>
                  <PromptInputActionMenuTrigger />
                  <PromptInputActionMenuContent>
                    <PromptInputActionAddAttachments />
                  </PromptInputActionMenuContent>
                </PromptInputActionMenu>
                <PromptInputSubmit disabled={!status} status={status} />
              </PromptInputFooter>
            </PromptInput>
          </PromptInputProvider>
        </div>
      </div>
    </div>
  )
}
