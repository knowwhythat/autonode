import { singleAsyncRoutes } from '@/utils/index'
import { userRoutes } from '@/router/routes'
const state = {
  token: '',
  userinfo: {},
  routes: [],
  singleRoutes: [],
  activeRoute: '/',
  keepAliveRoutes: [],
  getIsDynamicRoute: false,
  localConfig: {},
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERINFO: (state, userinfo) => {
    state.userinfo = userinfo
  },
  SET_ROUTES: (state, routes) => {
    state.routes = routes
  },
  SET_SINGLEROUTES: (state, routes) => {
    state.singleRoutes = routes
  },
  SET_KEEPALIVEROUTES: (state, routes) => {
    state.keepAliveRoutes = routes
  },
  SET_ACTIVEROUTE: (state, activeRoute) => {
    state.activeRoute = activeRoute
  },
  SET_DYNAMICROUTE: (state, status) => {
    state.getIsDynamicRoute = status
  },
  SET_LOCAL_CONFIG: (state, config) => {
    state.localConfig = config
  },
}

const actions = {
  loginSet({ commit }, userinfo) {
    commit('SET_TOKEN', userinfo.token)
    commit('SET_USERINFO', userinfo)
  },
  loginOutSet({ commit }) {
    commit('SET_TOKEN', null)
    commit('SET_USERINFO', null)
  },
  activeRoute({ commit }, path) {
    commit('SET_ACTIVEROUTE', path)
  },
  getUserRoutes({ state, commit, dispatch }) {
    return new Promise((resolve, reject) => {
      commit('SET_ROUTES', userRoutes)
      let single = singleAsyncRoutes(userRoutes)
      commit('SET_SINGLEROUTES', single)
      commit('SET_DYNAMICROUTE', true)
      dispatch('getKeepAlive')
      resolve(userRoutes)
    })
  },
  getKeepAlive({ state, commit }) {
    let keepAliveRoutes = []
    state.singleRoutes.map(item => {
      if (item.meta && item.meta.keepAlive) {
        keepAliveRoutes.push(item.name)
      }
    })
    commit('SET_KEEPALIVEROUTES', keepAliveRoutes)
  },
  setKeepAlive({ commit }, keepAliveRoutes) {
    commit('SET_KEEPALIVEROUTES', keepAliveRoutes)
  },
  setDynamicRoute({ commit }, status) {
    commit('SET_DYNAMICROUTE', status)
  },
  setLocalConfig({ commit }, config) {
    commit('SET_LOCAL_CONFIG', config)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
