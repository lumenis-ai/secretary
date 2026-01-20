import { Store } from '@tauri-apps/plugin-store'
import { useMemo, useState } from 'react'

export function useServer() {
  const [serverPort, setServerPort] = useState(import.meta.env.VITE_SERVER_PORT)
  const serverBaseUrl = useMemo(() => `http://127.0.0.1:${serverPort}`, [serverPort])

  if (!import.meta.env.VITE_SERVER_PORT) {
    try {
      Store.load('settings.json').then(async (store) => {
        setServerPort(Number.parseInt(await store.get('server_port') || '0'))
      })
    }
    catch (error) {
      console.error(error)
    }
  }

  return {
    serverPort,
    serverBaseUrl,
  }
}
