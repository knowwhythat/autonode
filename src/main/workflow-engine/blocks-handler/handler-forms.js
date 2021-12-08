import { getBlockConnection } from '../helper'
async function forms(block, prevBlockData) {
  const { selected, selector, type, value } = block.data
  if (type == 'text-field') {
    this.page.fill(selector, value)
  } else if (type == 'select') {
    this.page.selectOption(selector, value)
  } else if (type == 'checkbox' || type == 'radio') {
    this.page.selectOption(selector, selected)
  }
  return {
    data: value,
    nextBlockId: getBlockConnection(block),
  }
}

export default forms
