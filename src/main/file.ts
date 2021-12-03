import fs from 'fs'
import path from 'path'
import { app } from 'electron'

const user_config = 'user_config.json'
const base_path = 'userData'
const basePath = app.getPath(base_path)
const userConfigPath = basePath + path.sep + user_config
const workflowsPath = basePath + path.sep + 'workflows'

export interface UserConfig {
  workflowsPath?: string
}

export const DEFAULT_CONFIG = {
  workflowsPath: workflowsPath,
}

export async function getUserConfig(): Promise<UserConfig> {
  return new Promise<UserConfig>((r, j) => {
    readJsonPromise(userConfigPath)
      .then(data => {
        r({
          ...DEFAULT_CONFIG,
          ...data,
        })
      })
      .catch(() => {
        // 如果用户信息报错 则需要使用默认数据进行覆盖
        saveJsonPromise(userConfigPath, DEFAULT_CONFIG)
          .then(() => {
            r(DEFAULT_CONFIG)
          })
          .catch(err => {
            j(err)
          })
      })
  })
}

export async function readJsonPromise(filePath: string): Promise<any> {
  return new Promise<any>((res, rej) => {
    const tempFilePath = filePath.endsWith('.json')
      ? filePath
      : `${filePath}.json`
    readNormalFile(tempFilePath)
      .then(data => {
        res(JSON.parse(data.toString().replace(/^\uFEFF/, '')))
      })
      .catch(err => {
        rej(err)
      })
  })
}

export async function readNormalFile(filePath: string): Promise<Buffer> {
  // 通用的文件读取方法
  return new Promise<Buffer>((res, rej) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        rej(err)
      } else {
        res(data)
      }
    })
  })
}

export const saveJsonPromise = (filePath: string, data: any) => {
  return new Promise((res, rej) => {
    const tempData =
      typeof data === 'string' ? data : JSON.stringify(data, null, 2)
    const tempFilePath = filePath.endsWith('.json')
      ? filePath
      : `${filePath}.json`
    if (!tempData) {
      rej(new Error('error'))
    } else {
      saveNormalFile(tempFilePath, tempData)
        .then(data => {
          res(data)
        })
        .catch(err => {
          rej(err)
        })
    }
  })
}

export const saveNormalFile = (file: string, dataBuffer: string) => {
  // 通用的文件保方法
  return new Promise((res, rej) => {
    fs.writeFile(file, dataBuffer, err => {
      if (err) {
        rej(err)
      } else {
        res(dataBuffer)
      }
    })
  })
}
