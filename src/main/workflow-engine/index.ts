import { parseJSON } from '../utils/helper'
import { Workflow, Block } from '../models/workflow'
import { tasks } from './shared'
import { camelCase } from 'lodash'
import { blockHandlers } from './blocks-handler'

export class WorkflowEngine {
  id: string
  tabId: string
  workflow: Workflow
  isInCollection: boolean
  collectionLogId: string
  globalData: any
  activeTabUrl: string
  data: any
  logs: any
  blocks: Map<string, Block>
  frames: any
  loopList: any
  loopData: any
  repeatedTasks: any
  eventListeners: any
  isPaused: boolean
  isDestroyed: boolean
  frameId: string
  windowId: string
  tabGroupId: string
  currentBlock: any
  tabUpdatedListeners: any
  startedTimestamp: number
  workflowTimeout: NodeJS.Timeout | undefined

  constructor(workflow: Workflow, { globalData = '', tabId = '', isInCollection = false, collectionLogId = '' }) {
    const globalDataVal = globalData || workflow.globalData
    this.id = workflow.workflowId
    this.tabId = tabId
    this.workflow = workflow
    this.isInCollection = isInCollection
    this.collectionLogId = collectionLogId
    this.globalData = parseJSON(globalDataVal, globalDataVal)
    this.activeTabUrl = ''
    this.data = {}
    this.logs = []
    this.blocks = new Map()
    this.frames = {}
    this.loopList = {}
    this.loopData = {}
    this.repeatedTasks = {}
    this.eventListeners = {}
    this.isPaused = false
    this.isDestroyed = false
    this.frameId = ''
    this.windowId = ''
    this.tabGroupId = ''
    this.currentBlock = null
    this.startedTimestamp = -1
    this.workflowTimeout = undefined

    this.tabUpdatedListeners = {}
    // this.tabUpdatedHandler = tabUpdatedHandler.bind(this)
    // this.tabRemovedHandler = tabRemovedHandler.bind(this)
  }
  init() {
    if (this.workflow.isDisabled) return
    const drawflowData = typeof this.workflow.drawflow === 'string' ? JSON.parse(this.workflow.drawflow || '{}') : this.workflow.drawflow
    const blocks: Map<string, Block> = drawflowData?.drawflow.Home.data

    if (!blocks) {
      console.error('no block')
      return
    }

    const blocksArr = Object.values(blocks)
    const triggerBlock = blocksArr.find(block => block.name === 'trigger')

    if (!triggerBlock) {
      console.error('no-trigger-block')
      return
    }

    const dataColumns = Array.isArray(this.workflow.dataColumns) ? this.workflow.dataColumns : Object.values(this.workflow.dataColumns)
    this.blocks = blocks
    console.log(blocks)
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

  on(name: string, listener: any) {
    ;(this.eventListeners[name] = this.eventListeners[name] || []).push(listener)
  }

  pause(pause = true) {
    this.isPaused = pause
    // workflowState.update(this.id, this.state)
  }

  stop(message: string) {
    this.logs.push({
      message,
      type: 'stop',
      name: 'stop',
    })
    this.destroy('stopped')
  }

  async destroy(status: string, message = '') {}

  _blockHandler(block: Block, prevBlockData = null) {
    if (this.isDestroyed) return
    if (this.isPaused) {
      setTimeout(() => {
        this._blockHandler(block, prevBlockData)
      }, 1000)

      return
    }
    const disableTimeoutKeys = ['delay', 'javascript-code']
    if (!disableTimeoutKeys.includes(block ? block?.name : '')) {
      this.workflowTimeout = setTimeout(() => {
        if (!this.isDestroyed) this.stop('stop-timeout')
      }, this.workflow.settings.timeout || 120000)
    }
    this.currentBlock = block
    const started = Date.now()

    const blockHandler = blockHandlers.get(camelCase(block?.name))
    const handler =
      !blockHandler && (<Map<string, Map<string, any>>>(<unknown>tasks)).get(block ? block.name : '')?.get('category') === 'interaction'
        ? blockHandlers.get('interactionHandler')
        : blockHandler
    if (handler) {
      handler
        .call(this, block)
        .then(result => {
          this.workflowTimeout ? clearTimeout(this.workflowTimeout) : ''
          this.workflowTimeout = undefined
          if (result.nextBlockId) {
            let block = this.blocks.get(result.nextBlockId)
            if (block) {
              this._blockHandler(block, result.data)
            }
          } else {
            this.destroy('success')
          }
        })
        .catch(err => {
          if (this.workflow.settings.onError === 'keep-running' && err.nextBlockId) {
            let block = this.blocks.get(err.nextBlockId)
            if (block) {
              this._blockHandler(block, err.data)
            }
          } else {
            this.destroy('error', err.message)
          }
          if (this.workflowTimeout) {
            clearTimeout(this.workflowTimeout)
            this.workflowTimeout = undefined
          }
        })
    } else {
      console.error(`"${block.name}" block doesn't have a handler`)
    }
  }
}
