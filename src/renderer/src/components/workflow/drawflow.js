import { h, render } from 'vue'
import Drawflow from 'drawflow'
import '@/assets/style/drawflow.css'

const blockComponents = import.meta.globEager('../block/*.vue')

export default function (element, { context, options = {} }) {
  const editor = new Drawflow(element, { render, version: 3, h }, context)

  editor.useuuid = true

  Object.entries(options).forEach(([key, value]) => {
    editor[key] = value
  })

  Object.keys(blockComponents).forEach(key => {
    const name = key.replace(/(.*\/)*([^.]+).*/gi, '$2')
    editor.registerNode(name, blockComponents[key].default, { editor }, {})
  })

  return editor
}
