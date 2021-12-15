import { getBlockConnection, convertData } from '../helper'
async function attributeValue(block, prevBlockData) {
  const { selector, attributeName, saveData, dataColumn } = block.data
  let attributeValue = await this.page.getAttribute(selector, attributeName)

  const getColumn = name =>
    this.workflow.dataColumns.find(item => item.name === name) || {
      name: 'column',
      type: 'text',
    }
  const pushData = (column, value) => {
    this.data[column.name]?.push(convertData(value, column.type))
  }
  if (saveData && attributeValue) {
    const column = getColumn(block.data.dataColumn)
    pushData(column, attributeValue)
  }
  return {
    data: attributeValue,
    nextBlockId: getBlockConnection(block),
  }
}

export default attributeValue
