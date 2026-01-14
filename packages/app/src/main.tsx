import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Navigate, Route, Routes } from 'react-router'
import BasicLayout from './layouts/basic'
import Models from './routes/models'
import ModelManager from './routes/staffs/model-manager'
import '@/assets/styles/root.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<BasicLayout />}>
            <Route index element={<Navigate to="/staffs/model-manager" replace />} />
            <Route path="/staffs/model-manager" element={<ModelManager />} />
            <Route path="/models" element={<Models />} />
          </Route>
        </Routes>
      </HashRouter>
    </QueryClientProvider>

  </React.StrictMode>,
)
