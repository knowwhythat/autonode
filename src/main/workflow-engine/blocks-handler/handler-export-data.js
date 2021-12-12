import path from 'path'
import { getBlockConnection } from '../helper'
import { downloadsPath } from '../../config'
import { saveJsonPromise } from '../../utils/file'

async function exportData(block) {
  await saveJsonPromise(`${downloadsPath}${path.sep}${block.data.name}.${block.data.type}`, this.data)

  return {
    data: '',
    nextBlockId: getBlockConnection(block),
  }
}

export default exportData
