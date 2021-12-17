import { win } from '..'
import { tasks } from '../../renderer/src/utils/shared'
import { parseJSON } from '../utils/helper'
import { camelCase } from 'lodash'
import referenceData from '../utils/reference-data'

let reloadTimeout

function tabRemovedHandler(tabId) {
  if (tabId !== this.tabId) return

  delete this.tabId

  if (this.currentBlock.name === 'new-tab' || tasks[this.currentBlock.name].category === 'interaction') {
    this.destroy('error', 'Current active tab is removed')
  }
}
function tabUpdatedHandler(tabId, changeInfo, tab) {
  const listener = this.tabUpdatedListeners[tabId]

  if (listener) {
    listener.callback(tabId, changeInfo, () => {
      delete this.tabUpdatedListeners[tabId]
    })
  } else if (this.tabId === tabId) {
    if (!reloadTimeout) {
      reloadTimeout = setTimeout(() => {
        this.isPaused = false
      }, 15000)
    }

    this.isPaused = true
  }
}

class WorkflowEngine {
  constructor(workflow, { globalData, blocksHandler, isInCollection, collectionLogId }) {
    const globalDataVal = globalData || workflow.globalData
    this.workflowId = workflow.workflowId
    this.executionId = workflow.executionId
    this.workflow = workflow
    this.blocksHandler = blocksHandler
    this.browser = null
    this.context = null
    this.page = null
    this.isInCollection = isInCollection
    this.collectionLogId = collectionLogId
    this.globalData = parseJSON(globalDataVal, globalDataVal)
    this.activeTabUrl = ''
    this.data = {}
    this.blocks = {}
    this.frames = {}
    this.loopList = {}
    this.loopData = {}
    this.repeatedTasks = {}
    this.eventListeners = {}
    this.isPaused = false
    this.isDestroyed = false
    this.frameId = null
    this.currentBlock = null
    this.workflowTimeout = null

    this.tabUpdatedListeners = {}
    this.tabUpdatedHandler = tabUpdatedHandler.bind(this)
    this.tabRemovedHandler = tabRemovedHandler.bind(this)
  }

  init() {
    if (this.workflow.isDisabled) return

    const drawflowData = typeof this.workflow.drawflow === 'string' ? JSON.parse(this.workflow.drawflow || '{}') : this.workflow.drawflow
    const blocks = drawflowData?.drawflow.Home.data

    if (!blocks) {
      this.reportLog({ isFailed: true, message: 'no-block' })
      return
    }
    const blocksArr = Object.values(blocks)
    const triggerBlock = blocksArr.find(({ name }) => name === 'trigger')

    if (!triggerBlock) {
      this.reportLog({ isFailed: true, message: 'no-trigger-block' })
      return
    }

    const dataColumns = Array.isArray(this.workflow.dataColumns) ? this.workflow.dataColumns : Object.values(this.workflow.dataColumns)

    this.blocks = blocks
    this.startedTimestamp = Date.now()
    this.workflow.dataColumns = dataColumns
    this.data = dataColumns.reduce(
      (acc, column) => {
        acc[column.name] = []
        return acc
      },
      { column: [] }
    )
    this._blockHandler(triggerBlock)
  }

  on(name, listener) {
    ;(this.eventListeners[name] = this.eventListeners[name] || []).push(listener)
  }

  pause(pause = true) {
    this.isPaused = pause
  }

  stop(message) {
    this.destroy('stopped', message)
  }

  async destroy(status, message) {
    try {
      this.dispatchEvent('destroyed', { workflowId: this.workflowId, status, message })

      this.eventListeners = {}
      this.tabUpdatedListeners = {}

      clearTimeout(this.workflowTimeout)
      await this.browser.close()
      this.browser = null
      this.page = null
      this.context = null
      this.isDestroyed = true
      this.endedTimestamp = Date.now()
      this.reportLog({ isFailed: status === 'error', message: message })
    } catch (error) {
      console.error(error)
    }
  }

  dispatchEvent(name, params) {
    const listeners = this.eventListeners[name]

    if (!listeners) return

    listeners.forEach(callback => {
      callback(params)
    })
  }

  get state() {
    const keys = ['workflowId', 'executionId', 'isPaused', 'isDestroyed', 'currentBlock']
    const state = keys.reduce((acc, key) => {
      acc[key] = this[key]
      return acc
    }, {})
    return state
  }

  _blockHandler(block, prevBlockData) {
    if (this.isDestroyed) return
    if (this.isPaused) {
      setTimeout(() => {
        this._blockHandler(block, prevBlockData)
      }, 1000)

      return
    }

    const disableTimeoutKeys = ['delay', 'javascript-code']

    if (!disableTimeoutKeys.includes(block.name)) {
      this.workflowTimeout = setTimeout(() => {
        if (!this.isDestroyed) this.stop('stop-timeout')
      }, this.workflow.settings.timeout || 120000)
    }

    this.currentBlock = block

    this.dispatchEvent('update', this.state)

    const started = Date.now()
    const handler = this.blocksHandler[camelCase(block?.name)]

    if (handler) {
      const replacedBlock = referenceData(block, {
        prevBlockData,
        data: this.data,
        loopData: this.loopData,
        globalData: this.globalData,
        activeTabUrl: this.activeTabUrl,
      })
      handler
        .call(this, replacedBlock, prevBlockData)
        .then(result => {
          this.reportLog({ duration: Math.round(Date.now() - started) })
          clearTimeout(this.workflowTimeout)
          this.workflowTimeout = null
          if (result.nextBlockId) {
            this._blockHandler(this.blocks[result.nextBlockId], result.data)
          } else {
            this.dispatchEvent('finish')
            this.destroy('success')
          }
        })
        .catch(error => {
          this.reportLog({ isFailed: true, duration: Math.round(Date.now() - started), message: error.message })
          if (this.workflow.settings.onError === 'keep-running' && error.nextBlockId) {
            this._blockHandler(this.blocks[error.nextBlockId], error.data || '')
          } else {
            this.destroy('error', error.message)
          }

          clearTimeout(this.workflowTimeout)
          this.workflowTimeout = null
          console.error(error)
        })
    } else {
      this.reportLog({ isFailed: true, message: `"${block.name}" block doesn't have a handler` })
      console.error(`"${block.name}" block doesn't have a handler`)
    }
  }

  _listener({ workflowId, name, callback, once = true, ...options }) {
    const listenerNames = {
      event: 'eventListener',
      'tab-updated': 'tabUpdatedListeners',
    }
    this[listenerNames[name]][workflowId] = { callback, once, ...options }
  }

  reportLog(message) {
    win.webContents.send('workflowLog', { ...this.state, ...message })
  }
}

export default WorkflowEngine
