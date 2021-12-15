import { getBlockConnection } from '../helper'
async function javascriptCode(block, prevBlockData) {
  const { code, timeout } = block.data
  const vm = require('vm')
  const result = await vm.runInThisContext(code, { timeout: timeout })(this.page)
  console.log(result)
  return {
    data: '',
    nextBlockId: getBlockConnection(block),
  }
}

export default javascriptCode
