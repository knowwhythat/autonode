import { createRouter, createWebHashHistory } from 'vue-router'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'

const routes = [
  {
    path: '/404',
    name: '404',
    component: () => import('@/pages/404/index.vue'),
    meta: { title: '404', tabShow: false },
  },
  {
    path: '/',
    name: 'Loading',
    component: () => import('@/pages/loading/index.vue'),
    meta: { title: '加载中', tabShow: false },
  },
]
const router = createRouter({
  routes,
  history: createWebHashHistory(),
})

// 前置守卫：路由跳转之前
// to 要进入的路由
// from 从那个路由过来的
router.beforeEach((to, form, next) => {
  // start progress bar
  NProgress.start()
  // 动态修改网页标题
  if (to.meta.title) {
    document.title = to.meta.title
  }
  if (to.matched.length < 1) {
    next({ path: '/' })
  } else {
    next()
  }
})

// 后置守卫：路由跳转之后
router.afterEach((to, form) => {
  NProgress.done()
  if (to.meta.tabShow) {
    store.dispatch('app/addTabs', {
      fullPath: to.fullPath,
      name: to.name,
      meta: to.meta,
    })
  }
  store.dispatch('user/activeRoute', to.fullPath)
  //恢复原始keepalive
  store.dispatch('user/getKeepAlive')
})

export default router
