import path from 'path'
import { app } from 'electron'
import { getUserConfig } from './file'

const user_config = 'user_config.json'
const base_path = 'userData'
const basePath = app.getPath(base_path)
const userConfigPath = basePath + path.sep + user_config
const workflowPath = basePath + path.sep + 'workflows'

export interface UserConfig {
  workflowPath: string
}

const DEFAULT_CONFIG: UserConfig = {
  workflowPath: workflowPath,
}

var userConfig: UserConfig

export async function fetchUserConfig(): Promise<UserConfig> {
  return new Promise<UserConfig>((res, rej) => {
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
