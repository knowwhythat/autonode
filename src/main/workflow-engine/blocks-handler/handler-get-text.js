import { getBlockConnection, convertData } from '../helper'

async function getText(block, prevBlockData) {
  let regex
  const { regex: regexData, regexExp, prefixText, suffixText, multiple, selector, saveData, dataColumn } = block.data
  const textResult = []

  if (regexData) {
    regex = new RegExp(regexData, regexExp.join(''))
  }

  let text = await this.page.innerText(selector, {})
  if (regex) text = text.match(regex).join(' ')

  text = (prefixText || '') + text + (suffixText || '')

  const getColumn = name =>
    this.workflow.dataColumns.find(item => item.name === name) || {
      name: 'column',
      type: 'text',
    }
  const pushData = (column, value) => {
    this.data[column.name]?.push(convertData(value, column.type))
  }
  if (saveData) {
    const column = getColumn(block.data.dataColumn)
    pushData(column, text)
  }

  return {
    data: '',
    nextBlockId: getBlockConnection(block),
  }
}

export default getText
