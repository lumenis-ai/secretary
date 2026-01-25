import type { StorageListThreadsOutput } from '@mastra/core/storage'
import { useInfiniteQuery } from '@tanstack/react-query'
import { MessageSquare, Plus } from 'lucide-react'
import { useMemo } from 'react'
import { NavLink, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useServer } from '@/hooks/use-server'

export default function BasicLayout() {
  const { serverBaseUrl } = useServer()

  const { data: infiniteThreads } = useInfiniteQuery<StorageListThreadsOutput>({
    queryKey: ['threads', serverBaseUrl],
    queryFn: ({ pageParam = 0 }) => {
      return fetch(`${serverBaseUrl}/api/memory/threads?perPage=20&page=${pageParam}`).then(res => res.json())
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.hasMore) {
        return
      }

      return lastPage.page + 1
    },
  })
  const threads = useMemo(() => {
    return infiniteThreads?.pages.flatMap(page => page.threads) ?? []
  }, [infiniteThreads])

  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const currentThreadId = useMemo(() => searchParams.get('threadId'), [searchParams])

  const navigate = useNavigate()

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>
              Threads
            </SidebarGroupLabel>
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarGroupAction onClick={() => navigate('/chat')}>
                  <Plus />
                </SidebarGroupAction>
              </TooltipTrigger>
              <TooltipContent side="right" align="center">
                New chat
              </TooltipContent>
            </Tooltip>
            <SidebarGroupContent>
              <SidebarMenu>
                {threads.map(thread => (
                  <Tooltip key={thread.id}>
                    <TooltipTrigger asChild>
                      <SidebarMenuItem>
                        <SidebarMenuButton isActive={pathname === '/chat' && currentThreadId === thread.id} asChild>
                          <NavLink to={`/chat?threadId=${thread.id}`}>
                            <MessageSquare />
                            <span className="truncate">{thread.title}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center">
                      {thread.title}
                    </TooltipContent>
                  </Tooltip>

                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main className="flex-1 flex flex-col overflow-hidden p-2">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
        </div>
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
