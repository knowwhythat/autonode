import { camelCase } from 'lodash'

const blocksHandler = import.meta.globEager('./blocks-handler/*.js')
const handlers = Object.keys(blocksHandler).reduce((acc, key) => {
  const name = key.replace(/(.*\/)*([^.]+).*/gi, '$2').replace('handler-', '')

  acc[camelCase(name)] = blocksHandler[key].default

  return acc
}, {})

export default handlers
