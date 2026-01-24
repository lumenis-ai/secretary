import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Navigate, Route, Routes } from 'react-router'
import BasicLayout from './layouts/basic'
import Chat from './routes/chat'
import '@/assets/styles/root.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<BasicLayout />}>
            <Route index element={<Navigate to="/chat" replace />} />
            <Route path="/chat" element={<Chat />} />
          </Route>
        </Routes>
      </HashRouter>
    </QueryClientProvider>

  </React.StrictMode>,
)
