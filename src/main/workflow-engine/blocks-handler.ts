import { WorkflowEngine } from '.'
import { Block } from '../models/workflow'

export interface HandlerResult {
  nextBlockId: string | undefined
  data: any
}

function getBlockConnection(block: Block, index = 1): string | undefined {
  const blockId = block.outputs[`output_${index}`]?.connections[0]?.node

  return blockId
}

export async function trigger(this: WorkflowEngine, block: Block): Promise<HandlerResult> {
  const nextBlockId = getBlockConnection(block)
  return { nextBlockId, data: '' }
}

export async function newTab(this: WorkflowEngine, block: Block): Promise<HandlerResult> {
  const { url } = block.data

  const nextBlockId = getBlockConnection(block)
  return { nextBlockId, data: '' }
}

export const blockHandlers = new Map([['trigger', trigger]])
