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
  ADD_LOG(state, log) {
    if (!state.logs[log.id]) {
      state.logs[log.id] = []
    }
    state.logs[log.id].push(log)
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
      executeWorkflow(workflow)
    }
  },
  reportLog({ commit, state }, log) {
    if (log.id) {
      commit('ADD_LOG', log)
      if (log.isDestroyed) {
        commit('UPDATE_WORKFLOW', { ...state.workflows[log.id], executing: false })
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
