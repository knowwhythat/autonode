import { getBlockConnection } from '../helper'

async function trigger(block) {
  const nextBlockId = getBlockConnection(block)

  return { nextBlockId, data: '' }
}

export default trigger
