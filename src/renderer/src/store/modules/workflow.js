import { nanoid } from 'nanoid'
import { listWorkflows, saveWorkflow, delWorkflow, executeWorkflow } from '@/utils/ipc'
const state = {
  workflows: {},
  logs: {},
}

const mutations = {
  SET_WORKFLOWS(state, workflows) {
    state.workflows = workflows
  },
  SAVE_WORKFLOW(state, workflow) {
    state.workflows[workflow.workflowId] = workflow
  },
  DEL_WORKFLOW(state, workflow) {
    state.workflows = delete state.workflows[workflow.workflowId]
  },
  UPDATE_WORKFLOW(state, workflow) {
    state.workflows[workflow.workflowId] = workflow
  },
  ADD_LOG_RECORD(state, execution) {
    const { executionId, name, icon } = execution
    if (!state.logs[execution.workflowId]) {
      state.logs[execution.workflowId] = []
    }
    state.logs[execution.workflowId].push({
      executionId: executionId,
      name: name,
      icon: icon,
      name,
      icon,
      status: 'executing',
      startTime: new Date(),
      duration: null,
      logs: [],
    })
  },
  APPEND_LOG(state, log) {
    if (!state.logs[log.workflowId]) {
      state.logs[log.workflowId] = []
    }
    let execution = state.logs[log.workflowId].find(execution => execution.executionId === log.executionId)
    if (log.isDestroyed) {
      execution.status = 'success'
      execution.duration = Math.round(Date.now() - execution.startTime)
    }
    if (log.isPaused) {
      execution.status = 'pause'
    }
    if (log.isFailed) {
      execution.status = 'fail'
      execution.duration = Math.round(Date.now() - execution.startTime)
    }
    execution.logs.push(log)
  },
}

const actions = {
  listWorkflow() {
    listWorkflows()
  },
  setWorkflows({ commit }, workflows) {
    let data = workflows.reduce((acc, workflow) => {
      acc[workflow.workflowId] = workflow
      return acc
    }, {})
    commit('SET_WORKFLOWS', data)
  },
  updateWorkFlow({ commit }, workflow) {
    return new Promise((resolve, reject) => {
      if (workflow.workflowId) {
        commit('UPDATE_WORKFLOW', workflow)
        saveWorkflow(workflow)
      }
      resolve(workflow)
    })
  },
  saveWorkFlow({ commit, state }, workflow) {
    if (workflow.workflowId) {
      commit('SAVE_WORKFLOW', workflow)
      saveWorkflow(workflow)
    }
  },
  delWorkFlow({ commit }, workflow) {
    if (workflow.workflowId) {
      commit('DEL_WORKFLOW', workflow)
      delWorkflow(workflow.workflowId)
    }
  },
  executeWorkflow({ commit }, workflow) {
    if (workflow.workflowId) {
      commit('UPDATE_WORKFLOW', { ...workflow, executing: true })
      let execution = { ...workflow, executionId: nanoid(32) }
      commit('ADD_LOG_RECORD', execution)
      executeWorkflow(execution)
    }
  },
  reportLog({ commit, state }, log) {
    if (log.workflowId) {
      commit('APPEND_LOG', log)
      if (log.isDestroyed) {
        commit('UPDATE_WORKFLOW', { ...state.workflows[log.workflowId], executing: false })
      }
    }
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
