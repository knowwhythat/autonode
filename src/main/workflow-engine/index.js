import Engine from './engine'
import blocksHandler from './blocks-handler'

export default function (workflow, event, options = {}) {
  const engine = new Engine(workflow, event, { ...options, blocksHandler })

  return engine
}
