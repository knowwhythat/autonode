export function init(store) {
  window.ipcRenderer.on('workflowLog', (event, data) => {
    store.dispatch('workflow/reportLog', data)
  })
  listWorkflows().then(data => {
    store.dispatch('workflow/setWorkflows', data)
    window.removeLoading()
  })
}

export function listWorkflows() {
  return window.ipcRenderer.invoke('listWorkflows')
}

export function saveWorkflow(data) {
  window.ipcRenderer.send('saveWorkflow', JSON.stringify(data, null, 2))
}

export function delWorkflow(workflowId) {
  window.ipcRenderer.send('delWorkflow', workflowId)
}

export function executeWorkflow(data) {
  window.ipcRenderer.send('executeWorkflow', JSON.stringify(data, null, 2))
}
