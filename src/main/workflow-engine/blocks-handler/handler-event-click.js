import { getBlockConnection } from '../helper'
async function eventClick(block, prevBlockData) {
  const { selector } = block.data
  this.page.click(selector)
  return {
    data: '',
    nextBlockId: getBlockConnection(block),
  }
}

export default eventClick
