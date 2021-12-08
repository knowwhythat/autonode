import { getBlockConnection } from '../helper'

const playwright = require('playwright-core')
export async function newWindow(block) {
  const { headless, browser, executablePath, forceNew } = block.data
  try {
    if (this.browser && forceNew) {
      await this.browser.close()
      this.browser = null
    }
    if (!this.browser) {
      let option = { headless: headless }
      if (browser === 2) {
        option['executablePath'] = executablePath
      }
      this.browser = await playwright.chromium.launch(option)
    }
    return {
      data: '',
      nextBlockId: getBlockConnection(block),
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

export default newWindow
