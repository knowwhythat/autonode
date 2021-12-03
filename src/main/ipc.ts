import { BrowserWindow, ipcMain } from 'electron'
import { getUserConfig } from './file'

export async function ipc(window: BrowserWindow) {
  ipcMain.on('getUserConfig', (event, arg) => {
    getUserConfig().then(data => {
      event.reply('replyUserConfig', data)
    })
  })
}
