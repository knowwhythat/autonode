import { getBlockConnection, convertData } from '../helper'
async function javascriptCode(block, prevBlockData) {
  const { code, timeout } = block.data
  const vm = require('vm')
  const result = await vm.runInThisContext(code, { timeout: timeout })(this.page, this.data, prevBlockData)
  const getColumn = name =>
    this.workflow.dataColumns.find(item => item.name === name) || {
      name: 'column',
      type: 'text',
    }
  const pushData = (column, value) => {
    this.data[column.name]?.push(convertData(value, column.type))
  }
  Object.keys(result).map(key => {
    const name = getColumn(key)
    pushData(name, result[key])
  })
  return {
    data: '',
    nextBlockId: getBlockConnection(block),
  }
}

export default javascriptCode
