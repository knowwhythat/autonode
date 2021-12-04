import path from 'path'
import { BrowserWindow, ipcMain } from 'electron'
import { fetchUserConfig } from './config'
import { listWorkflows, saveJsonPromise, deleteFile } from './file'

export async function initIpc(window: BrowserWindow) {
  ipcMain.handle('listWorkflows', async (event, arg) => {
    const result = await fetchUserConfig()
      .then(config => {
        return listWorkflows(config.workflowPath)
      })
      .then(data => {
        return data
      })
    return result
  })

  ipcMain.on('saveWorkflow', (event, arg) => {
    let workflow = JSON.parse(arg.toString().replace(/^\uFEFF/, ''))
    fetchUserConfig().then(config => {
      return saveJsonPromise(path.join(config.workflowPath, workflow.workflowId), arg)
    })
  })

  ipcMain.on('delWorkflow', (event, arg) => {
    fetchUserConfig().then(config => {
      return deleteFile(path.join(config.workflowPath, arg + '.json'))
    })
  })
}
