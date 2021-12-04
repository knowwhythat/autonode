import { listWorkflows, saveWorkflow, delWorkflow, executeWorkflow } from '@/utils/ipc'
const state = {
  workflows: [],
}

const mutations = {
  SET_WORKFLOWS(state, workflows) {
    state.workflows = workflows
  },
  SAVE_WORKFLOW(state, workflow) {
    state.workflows.push(workflow)
  },
  DEL_WORKFLOW(state, workflow) {
    state.workflows = state.workflows.filter(({ workflowId }) => workflowId !== workflow.workflowId)
  },
  UPDATE_WORKFLOW(state, workflow) {
    state.workflows = state.workflows.map(saved => {
      if (saved.workflowId === workflow.workflowId) {
        return workflow
      } else {
        return saved
      }
    })
  },
}

const actions = {
  listWorkflow() {
    listWorkflows()
  },
  setWorkflows({ commit }, workflows) {
    commit('SET_WORKFLOWS', workflows)
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
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
