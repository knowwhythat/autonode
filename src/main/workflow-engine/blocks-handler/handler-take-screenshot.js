import { getBlockConnection, convertData } from '../helper'
import { basePath } from '../../config'
import path from 'path'
import { ensureDirectoryExistence } from '../../utils/file'

async function takeScreenshot(block, prevBlockData) {
  const { fullPage, selector, fileName, ext, saveData, dataColumn } = block.data
  if (saveData) {
    const buffer = await this.page.screenshot({ fullPage: fullPage })
    const getColumn = name =>
      this.workflow.dataColumns.find(item => item.name === name) || {
        name: 'column',
        type: 'text',
      }
    const pushData = (column, value) => {
      this.data[column.name]?.push(convertData(value, column.type))
    }
    if (saveData && buffer) {
      const column = getColumn(dataColumn)
      pushData(column, buffer.toString('base64'))
    }
  } else {
    const saveDir = basePath + path.sep + 'Screenshot' + path.sep
    ensureDirectoryExistence(saveDir)
    if (fullPage) {
      await this.page.screenshot({ path: `${saveDir}${fileName}.${ext}`, fullPage: true })
    } else {
      await this.page.locator(selector).screenshot({ path: `${saveDir}${fileName}.${ext}` })
    }
  }

  return {
    data: '',
    nextBlockId: getBlockConnection(block),
  }
}

export default takeScreenshot
