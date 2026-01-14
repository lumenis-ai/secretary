import { Store } from '@tauri-apps/plugin-store'

function getStore() {
  return Store.load('settings.json')
}

export function getServerPort() {
  return getStore().then((store) => {
    if (import.meta.env.VITE_SERVER_PORT) {
      return Number.parseInt(import.meta.env.VITE_SERVER_PORT)
    }

    return store.get('server_port')
  })
}

export async function getServerBaseUrl() {
  const port = await getServerPort()

  return `http://127.0.0.1:${port}`
}
