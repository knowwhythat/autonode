import path from 'path'
import { ipcMain } from 'electron'
import { fetchUserConfig } from './config'
import { listWorkflows, saveJsonPromise, deleteFile } from './utils/file'
import WorkflowEngine from './workflow-engine'

const runningWorkflows = {}

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

ipcMain.on('executeWorkflow', async (event, arg) => {
  try {
    const engine = new WorkflowEngine(JSON.parse(arg), event, {})
    engine.init()
    runningWorkflows[engine.id] = engine
    engine.on('destroyed', ({ id }) => {
      delete runningWorkflows[id]
    })
  } catch (e) {
    console.error(e)
    event.reply('执行失败')
  }
})

ipcMain.on('stopWorkflow', (event, arg) => {
  runningWorkflows[id]?.destroy()
  delete runningWorkflows[id]
})
