import { orderBy } from 'lodash'
const getters = {
  language: state => state.app.language,
  device: state => state.app.device,
  sidebar: state => state.app.sidebar,
  showSet: state => state.app.showSet,
  routes: state => state.user.routes,
  singleRoutes: state => state.user.singleRoutes,
  activeRoute: state => state.user.activeRoute,
  skinChoose: state => state.settings.skinChoose,
  getWorkflow: state => id => state.workflow.workflows[id],
  getWorkflows: state => (name, sortBy, sortOrder) =>
    orderBy(
      (Object.values(state.workflow.workflows) || []).filter(workflow => workflow.name.toLocaleLowerCase().includes(name.toLocaleLowerCase())),
      sortBy,
      sortOrder
    ),
}
export default getters
