const state = {
  workflowState: [],
  workflows: [
    {
      workflowId: '123456',
      name: '测试工作流11111111111111111111111111111111111111111111111111111111111111111111111111111111',
      icon: 'ri-window-line',
      drawflow: null,
      createAt: '2021-11-23 20:27:05',
    },
  ],
}

const mutations = {
  updateState(state, { key, value }) {
    state[key] = value
  },
  SAVE_WORKFLOW(state, workflow) {
    state.workflows.push(workflow)
  },
  DEL_WORKFLOW(state, workflow) {
    state.workflows = state.workflows.filter(
      ({ workflowId }) => workflowId !== workflow.workflowId
    )
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
  retrieveWorkflowState({ commit }) {
    try {
      const { workflowState } = {}
      commit('updateState', {
        key: 'workflowState',
        value: workflowState || [],
      })
    } catch (error) {
      console.error(error)
    }
  },
  updateWorkFlow({ commit }, workflow) {
    return new Promise((resolve, reject) => {
      if (workflow.workflowId) {
        commit('UPDATE_WORKFLOW', workflow)
      }
      resolve(workflow)
    })
  },
  saveWorkFlow({ commit }, workflow) {
    if (workflow.workflowId) {
      commit('SAVE_WORKFLOW', workflow)
    }
  },
  delWorkFlow({ commit }, workflow) {
    if (workflow.workflowId) {
      commit('DEL_WORKFLOW', workflow)
    }
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
