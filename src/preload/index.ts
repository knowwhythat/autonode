import { contextBridge, ipcRenderer, IpcRenderer } from 'electron'
import { domReady } from './utils'
import { useLoading } from './loading'

const { removeLoading, appendLoading } = useLoading()

domReady().then(() => {
  appendLoading()
})

// --------- Expose some API to Renderer process. ---------
contextBridge.exposeInMainWorld('removeLoading', removeLoading)
contextBridge.exposeInMainWorld('ipcRenderer', {
  ...ipcRenderer,
  on(...args: Parameters<IpcRenderer['on']>) {
    return ipcRenderer.on(...args)
  },
})
