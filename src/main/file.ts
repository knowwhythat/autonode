import fs from 'fs'
import path from 'path'
import { UserConfig } from './config'

export async function getUserConfig(userConfigPath: string, defaultConfig: UserConfig): Promise<UserConfig> {
  return new Promise<UserConfig>((r, j) => {
    readJsonPromise(userConfigPath)
      .then(data => {
        r({
          ...defaultConfig,
          ...data,
        })
      })
      .catch(() => {
        // 如果用户信息报错 则需要使用默认数据进行覆盖
        saveJsonPromise(userConfigPath, defaultConfig)
          .then(() => {
            r(defaultConfig)
          })
          .catch(err => {
            j(err)
          })
      })
  })
}

export async function readJsonPromise(filePath: string): Promise<any> {
  return new Promise<any>((res, rej) => {
    const tempFilePath = filePath.endsWith('.json') ? filePath : `${filePath}.json`
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

export const saveJsonPromise = (filePath: string, data: any): Promise<void> => {
  return new Promise<void>((res, rej) => {
    const tempData = typeof data === 'string' ? data : JSON.stringify(data, null, 2)
    const tempFilePath = filePath.endsWith('.json') ? filePath : `${filePath}.json`
    if (!tempData) {
      rej(new Error('error'))
    } else {
      saveNormalFile(tempFilePath, tempData)
        .then(() => {
          res()
        })
        .catch(err => {
          rej(err)
        })
    }
  })
}

export const saveNormalFile = (file: string, dataBuffer: string): Promise<void> => {
  // 通用的文件保方法
  return new Promise<void>((res, rej) => {
    fs.writeFile(file, dataBuffer, err => {
      if (err) {
        rej(err)
      } else {
        res()
      }
    })
  })
}

export const ensureDirectoryExistence = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    const parentDir = path.dirname(dirPath)
    ensureDirectoryExistence(parentDir)
    fs.mkdirSync(dirPath)
  }
}

export const listWorkflows = (dirPath: string) => {
  ensureDirectoryExistence(dirPath)
  return new Promise((res, rej) => {
    fs.readdir(dirPath, (err, files) => {
      if (!err) {
        // 读取所有的文件信息 此处需要过滤其他无效的文件(目前先过滤非json文件，以.开头的文件)
        Promise.all(files.filter(f => f.endsWith('.json') && !f.startsWith('.')).map(f => readJsonPromise(dirPath + path.sep + f))).then(data => res(data))
      } else {
        rej(err)
      }
    })
  })
}

export const deleteFile = (filePath: string) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }
}
