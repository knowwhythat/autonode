export function init(store) {
  window.ipcRenderer.on('replyUserConfig', (event, data) => {
    store.dispatch('user/setLocalConfig', data)
  })
  window.ipcRenderer.send('getUserConfig')
  window.removeLoading()
}
