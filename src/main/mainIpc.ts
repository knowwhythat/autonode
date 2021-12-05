import path from 'path'
import { BrowserWindow, ipcMain } from 'electron'
import { fetchUserConfig } from './config'
import { listWorkflows, saveJsonPromise, deleteFile } from './utils/file'
import { WorkflowEngine } from './workflow-engine/index'
import { Workflow } from './models/workflow'

export async function initIpc(window: BrowserWindow) {
  let runningWorkflow = new Map<string, WorkflowEngine>()
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

  ipcMain.on('executeWorkflow', (event, arg) => {
    let workflow = <Workflow>JSON.parse(arg)
    let workflowEngine
    if (runningWorkflow.has(workflow.workflowId)) {
      workflowEngine = runningWorkflow.get(workflow.workflowId)
      workflowEngine?.destroy('restart')
    } else {
      workflowEngine = new WorkflowEngine(<Workflow>JSON.parse(arg), {})
      runningWorkflow.set(workflowEngine.id, workflowEngine)
    }
    workflowEngine?.init()
    workflowEngine?.on('destroy', runningWorkflow.delete(workflow.workflowId))
  })

  ipcMain.on('stopWorkflow', (event, arg) => {
    if (runningWorkflow.has(arg)) {
      let workflowEngine = runningWorkflow.get(arg)
      workflowEngine?.destroy('stop')
      runningWorkflow.delete(arg)
    }
  })
}
