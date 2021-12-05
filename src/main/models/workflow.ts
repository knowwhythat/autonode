export interface Workflow {
  workflowId: string
  name: string
  icon: string
  data: any
  drawflow: string
  dataColumns: any
  globalData: any
  lastRunAt: number
  createdAt: number
  isDisabled: boolean
  settings: any
  logs: any
}

export interface Block {
  id: string
  name: string
  data: any
  class: string
  html: string
  typenode: string
  inputs: any
  outputs: any
  pos_x: number
  pos_y: number
}
