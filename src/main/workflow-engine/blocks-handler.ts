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
  console.log('trigger')
  const nextBlockId = getBlockConnection(block)
  return { nextBlockId, data: '' }
}

export async function newTab(this: WorkflowEngine, block: Block): Promise<HandlerResult> {
  console.log('newTab')
  const { firefox } = require('playwright')
  ;(async () => {
    const browser = await firefox.launch() // Or 'firefox' or 'webkit'.
    const page = await browser.newPage()
    await page.goto('http://example.com')
    // other actions...
    await browser.close()
  })()
  // const { url } = block.data
  // const browser = await firefox.launch()
  // const page = await browser.newPage()
  // await page.goto(url)
  // await page.screenshot({ path: `example.png` })
  // await browser.close()
  const nextBlockId = getBlockConnection(block)
  return { nextBlockId, data: '' }
}

export const blockHandlers = new Map([['trigger', trigger]])
