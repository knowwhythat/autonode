import path from 'path'
import { app } from 'electron'
import { getUserConfig } from './utils/file'

const user_config = 'user_config.json'
const base_path = 'userData'
export const basePath = app.getPath(base_path)
export const downloadsPath = app.getPath('downloads')
const userConfigPath = basePath + path.sep + user_config
const workflowPath = basePath + path.sep + 'workflows'

var userConfig

const DEFAULT_CONFIG = { workflowPath: workflowPath }

export async function fetchUserConfig() {
  return new Promise((res, rej) => {
    if (userConfig) {
      res(userConfig)
    } else {
      getUserConfig(userConfigPath, DEFAULT_CONFIG)
        .then(data => {
          userConfig = data
          res(userConfig)
        })
        .catch(err => {
          rej(err)
        })
    }
  })
}
