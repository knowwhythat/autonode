import { getBlockConnection } from '../helper'
import { basePath } from '../../config'
import path from 'path'
import { ensureDirectoryExistence } from '../../utils/file'

async function takeScreenshot(block, prevBlockData) {
  const { fullPage, selector, fileName, quality, ext } = block.data
  const saveDir = basePath + path.sep + 'Screenshot' + path.sep
  ensureDirectoryExistence(saveDir)
  if (fullPage) {
    await this.page.screenshot({ path: `${saveDir}${fileName}.${ext}`, fullPage: true, quality: quality })
  } else {
    await this.page.locator(selector).screenshot({ path: `${saveDir}${fileName}.${ext}`, quality: quality })
  }
  return {
    data: '',
    nextBlockId: getBlockConnection(block),
  }
}

export default takeScreenshot
