import path from 'path'
import { ipcMain } from 'electron'
import { fetchUserConfig } from './config'
import { listWorkflows, saveJsonPromise, deleteFile } from './utils/file'

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

const playwright = require('playwright-core')
ipcMain.on('executeWorkflow', async (event, arg) => {
  let workflow = JSON.parse(arg)
  const browser = await playwright.firefox.launch({ headless: false })
  const context = await browser.newContext()
  const page = await context.newPage()

  await page.goto('https://www.baidu.com/')
  await page.type("input[name='q']", 'Playwright')
  await page.keyboard.press('Enter')
  await page.waitForNavigation()
  await page.waitForSelector('#result-stats')
  const elHandle = await page.$('#result-stats')
  const resultText = await elHandle.evaluate(el => el.innerText)
  event.returnValue = resultText
  console.log(workflow)
})

ipcMain.on('stopWorkflow', (event, arg) => {})
