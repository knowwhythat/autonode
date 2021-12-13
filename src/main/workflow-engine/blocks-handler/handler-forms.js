import { getBlockConnection, convertData } from '../helper'
async function forms(block, prevBlockData) {
  const { getValue, selected, selector, type, value, saveData } = block.data
  if (getValue) {
    let result
    if (type == 'text-field' || type == 'select') {
      result = await this.page.inputValue(selector)
    } else if (type == 'checkbox' || type == 'radio') {
      result = await this.page.check(selector)
    }
    const getColumn = name =>
      this.workflow.dataColumns.find(item => item.name === name) || {
        name: 'column',
        type: 'text',
      }
    const pushData = (column, value) => {
      this.data[column.name]?.push(convertData(value, column.type))
    }
    if (saveData && result) {
      const column = getColumn(block.data.dataColumn)
      pushData(column, result)
    }
  } else {
    if (type == 'text-field') {
      this.page.fill(selector, value)
    } else if (type == 'select') {
      this.page.selectOption(selector, value)
    } else if (type == 'checkbox' || type == 'radio') {
      this.page.selectOption(selector, selected)
    }
  }

  return {
    data: value,
    nextBlockId: getBlockConnection(block),
  }
}

export default forms
