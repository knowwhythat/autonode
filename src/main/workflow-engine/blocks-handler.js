import { objectHasKey, isObject } from '../utils/helper'
import { executeWebhook } from '../utils/webhookUtil'
import { generateJSON } from '../utils/helper'
import compareBlockValue from '../utils/compare-block-value'

function getBlockConnection(block, index = 1) {
  const blockId = block.outputs[`output_${index}`]?.connections[0]?.node

  return blockId
}
function convertData(data, type) {
  let result = data

  switch (type) {
    case 'integer':
      result = +data.replace(/\D+/g, '')
      break
    case 'boolean':
      result = Boolean(data)
      break
    case 'array':
      result = Array.from(data)
      break
    default:
  }

  return result
}

export async function closeTab(block) {
  const nextBlockId = getBlockConnection(block)

  try {
    const { data } = block
    let tabIds

    if (data.activeTab && this.tabId) {
      tabIds = this.tabId
    } else if (data.url) {
      tabIds = (await browser.tabs.query({ url: data.url })).map(tab => tab.id)
    }

    if (tabIds) await browser.tabs.remove(tabIds)

    return {
      nextBlockId,
      data: '',
    }
  } catch (error) {
    const errorInstance = typeof error === 'string' ? new Error(error) : error
    errorInstance.nextBlockId = nextBlockId

    throw error
  }
}
export async function trigger(block) {
  const nextBlockId = getBlockConnection(block)
  try {
    return { nextBlockId, data: '' }
  } catch (error) {
    const errorInstance = new Error(error)
    errorInstance.nextBlockId = nextBlockId

    throw errorInstance
  }
}

export function loopBreakpoint(block, prevBlockData) {
  return new Promise(resolve => {
    const currentLoop = this.loopList[block.data.loopId]

    if (currentLoop && currentLoop.index < currentLoop.maxLoop - 1 && currentLoop.index <= currentLoop.data.length - 1) {
      resolve({
        data: '',
        nextBlockId: currentLoop.blockId,
      })
    } else {
      resolve({
        data: prevBlockData,
        nextBlockId: getBlockConnection(block),
      })
    }
  })
}

export function loopData(block) {
  return new Promise(resolve => {
    const { data } = block

    if (this.loopList[data.loopId]) {
      this.loopList[data.loopId].index += 1
      this.loopData[data.loopId] = this.loopList[data.loopId].data[this.loopList[data.loopId].index]
    } else {
      const currLoopData = data.loopThrough === 'data-columns' ? generateJSON(Object.keys(this.data), this.data) : JSON.parse(data.loopData)

      this.loopList[data.loopId] = {
        index: 0,
        data: currLoopData,
        id: data.loopId,
        blockId: block.id,
        maxLoop: data.maxLoop || currLoopData.length,
      }
      /* eslint-disable-next-line */
      this.loopData[data.loopId] = currLoopData[0]
    }

    resolve({
      data: this.loopData[data.loopId],
      nextBlockId: getBlockConnection(block),
    })
  })
}

export function goBack(block) {
  return new Promise((resolve, reject) => {
    const nextBlockId = getBlockConnection(block)

    if (!this.tabId) {
      const error = new Error('no-tab')
      error.nextBlockId = nextBlockId

      reject(error)

      return
    }

    browser.tabs
      .goBack(this.tabId)
      .then(() => {
        resolve({
          nextBlockId,
          data: '',
        })
      })
      .catch(error => {
        error.nextBlockId = nextBlockId
        reject(error)
      })
  })
}

export function forwardPage(block) {
  return new Promise((resolve, reject) => {
    const nextBlockId = getBlockConnection(block)

    if (!this.tabId) {
      const error = new Error('no-tab')
      error.nextBlockId = nextBlockId

      reject(nextBlockId)

      return
    }

    browser.tabs
      .goForward(this.tabId)
      .then(() => {
        resolve({
          nextBlockId,
          data: '',
        })
      })
      .catch(error => {
        error.nextBlockId = nextBlockId
        reject(error)
      })
  })
}

const playwright = require('playwright-core')
export async function newWindow(block) {
  const { headless, brower, executablePath, forceNew } = block.data
  try {
    if (this.browser && forceNew) {
      await this.browser.close()
      this.browser = null
    }
    if (!this.browser) {
      let option = { headless: headless }
      if (brower === 2) {
        option['executablePath'] = executablePath
      }
      this.browser = await playwright.chromium.launch(option)
    }
    return {
      data: '',
      nextBlockId: getBlockConnection(block),
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

function tabUpdatedListener(tab) {
  return new Promise(resolve => {
    this._listener({
      name: 'tab-updated',
      id: tab.id,
      callback: async (tabId, changeInfo, deleteListener) => {
        if (changeInfo.status !== 'complete') return

        deleteListener()

        resolve(frames)
      },
    })
  })
}
export async function newTab(block) {
  if (!this.browser) {
    this.browser = await playwright.chromium.launch({ headless: false })
  }

  try {
    const { url } = block.data
    const context = await this.browser.newContext()
    const page = await context.newPage()
    await page.goto(url)
    this.context = context
    this.page = page
    this.activeTabUrl = url
    return {
      data: url,
      nextBlockId: getBlockConnection(block),
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function activeTab(block) {
  const nextBlockId = getBlockConnection(block)

  try {
    const data = {
      nextBlockId,
      data: '',
    }

    if (this.tabId) {
      await browser.tabs.update(this.tabId, { active: true })

      return data
    }

    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    })

    this.frames = {}

    this.frameId = 0
    this.tabId = tab.id
    this.activeTabUrl = tab.url
    this.windowId = tab.windowId

    return data
  } catch (error) {
    console.error(error)
    return {
      data: '',
      message: error.message || error,
      nextBlockId,
    }
  }
}

export async function takeScreenshot(block) {
  const nextBlockId = getBlockConnection(block)
  const { ext, quality, captureActiveTab, fileName } = block.data

  function saveImage(uri) {
    const image = new Image()

    image.onload = () => {
      const name = `${fileName || 'Screenshot'}.${ext || 'png'}`
      const canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height

      const context = canvas.getContext('2d')
      context.drawImage(image, 0, 0)

      fileSaver(name, canvas.toDataURL())
    }

    image.src = uri
  }

  try {
    const options = {
      quality,
      format: ext || 'png',
    }

    if (captureActiveTab) {
      if (!this.tabId) {
        throw new Error('no-tab')
      }

      const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      })

      await browser.windows.update(this.windowId, { focused: true })
      await browser.tabs.update(this.tabId, { active: true })

      await new Promise(resolve => setTimeout(resolve, 500))

      const uri = await browser.tabs.captureVisibleTab(options)

      if (tab) {
        await browser.windows.update(tab.windowId, { focused: true })
        await browser.tabs.update(tab.id, { active: true })
      }

      saveImage(uri)
    } else {
      const uri = await browser.tabs.captureVisibleTab(options)

      saveImage(uri)
    }

    return { data: '', nextBlockId }
  } catch (error) {
    error.nextBlockId = nextBlockId

    throw error
  }
}

export async function switchTo(block) {
  const nextBlockId = getBlockConnection(block)

  try {
    if (block.data.windowType === 'main-window') {
      this.frameId = 0

      return {
        data: '',
        nextBlockId,
      }
    }

    const { url } = await this._sendMessageToTab(block, { frameId: 0 })

    if (objectHasKey(this.frames, url)) {
      this.frameId = this.frames[url]

      return {
        data: this.frameId,
        nextBlockId,
      }
    }

    const error = new Error('no-iframe-id')
    error.data = { selector: block.selector }

    throw error
  } catch (error) {
    error.nextBlockId = nextBlockId

    throw error
  }
}

export async function interactionHandler(block, prevBlockData) {
  const nextBlockId = getBlockConnection(block)

  try {
    const refData = {
      prevBlockData,
      dataColumns: this.data,
      loopData: this.loopData,
      globalData: this.globalData,
      activeTabUrl: this.activeTabUrl,
    }
    const data = await this._sendMessageToTab(
      { ...block, refData },
      {
        frameId: this.frameId || 0,
      }
    )

    if (block.name === 'link') await new Promise(resolve => setTimeout(resolve, 5000))

    if (data?.isError) {
      const error = new Error(data.message)
      error.nextBlockId = nextBlockId

      throw error
    }

    const getColumn = name =>
      this.workflow.dataColumns.find(item => item.name === name) || {
        name: 'column',
        type: 'text',
      }
    const pushData = (column, value) => {
      this.data[column.name]?.push(convertData(value, column.type))
    }

    if (objectHasKey(block.data, 'dataColumn')) {
      const column = getColumn(block.data.dataColumn)

      if (block.data.saveData) {
        if (Array.isArray(data) && column.type !== 'array') {
          data.forEach(item => {
            pushData(column, item)
          })
        } else {
          pushData(column, data)
        }
      }
    } else if (block.name === 'javascript-code') {
      const memoColumn = {}
      const pushObjectData = obj => {
        Object.entries(obj).forEach(([key, value]) => {
          let column

          if (memoColumn[key]) {
            column = memoColumn[key]
          } else {
            const currentColumn = getColumn(key)

            column = currentColumn
            memoColumn[key] = currentColumn
          }

          pushData(column, value)
        })
      }

      if (Array.isArray(data)) {
        data.forEach(obj => {
          if (isObject(obj)) pushObjectData(obj)
        })
      } else if (isObject(data)) {
        pushObjectData(data)
      }
    }

    return {
      data,
      nextBlockId,
    }
  } catch (error) {
    error.nextBlockId = nextBlockId

    throw error
  }
}

export function delay(block) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        nextBlockId: getBlockConnection(block),
        data: '',
      })
    }, block.data.time)
  })
}

export function exportData(block) {
  return new Promise(resolve => {
    dataExporter(this.data, block.data)

    resolve({
      data: '',
      nextBlockId: getBlockConnection(block),
    })
  })
}

export function elementExists(block) {
  return new Promise((resolve, reject) => {
    this._sendMessageToTab(block)
      .then(data => {
        resolve({
          data,
          nextBlockId: getBlockConnection(block, data ? 1 : 2),
        })
      })
      .catch(error => {
        error.nextBlockId = getBlockConnection(block)

        reject(error)
      })
  })
}

export function conditions({ data, outputs }, prevBlockData) {
  return new Promise((resolve, reject) => {
    if (data.conditions.length === 0) {
      reject(new Error('Conditions is empty'))
      return
    }

    let outputIndex = data.conditions.length + 1
    let resultData = ''
    const prevData = Array.isArray(prevBlockData) ? prevBlockData[0] : prevBlockData

    data.conditions.forEach(({ type, value }, index) => {
      const result = compareBlockValue(type, prevData, value)

      if (result) {
        resultData = value
        outputIndex = index + 1
      }
    })

    resolve({
      data: resultData,
      nextBlockId: getBlockConnection({ outputs }, outputIndex),
    })
  })
}

export function repeatTask({ data, id, outputs }) {
  return new Promise(resolve => {
    if (this.repeatedTasks[id] >= data.repeatFor) {
      resolve({
        data: data.repeatFor,
        nextBlockId: getBlockConnection({ outputs }),
      })
    } else {
      this.repeatedTasks[id] = (this.repeatedTasks[id] || 1) + 1

      resolve({
        data: data.repeatFor,
        nextBlockId: getBlockConnection({ outputs }, 2),
      })
    }
  })
}

export function webhook({ data, outputs }) {
  return new Promise((resolve, reject) => {
    const nextBlockId = getBlockConnection({ outputs })

    if (!data.url) {
      const error = new Error('URL is empty')
      error.nextBlockId = nextBlockId

      reject(error)
      return
    }

    if (!data.url.startsWith('http')) {
      const error = new Error('URL is not valid')
      error.nextBlockId = nextBlockId

      reject(error)
      return
    }

    executeWebhook(data)
      .then(() => {
        resolve({
          data: '',
          nextBlockId: getBlockConnection({ outputs }),
        })
      })
      .catch(error => {
        reject(error)
      })
  })
}
