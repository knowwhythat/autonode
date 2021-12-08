import { getBlockConnection } from '../helper'

const playwright = require('playwright-core')

export async function newTab(block) {
  if (!this.browser) {
    this.browser = await playwright.chromium.launch({ headless: false })
  }

  try {
    const { url } = block.data
    const context = await this.browser.newContext()
    const page = await context.newPage()
    await page.goto(url)
    this.context = context
    this.page = page
    this.activeTabUrl = url
    return {
      data: url,
      nextBlockId: getBlockConnection(block),
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

export default newTab
