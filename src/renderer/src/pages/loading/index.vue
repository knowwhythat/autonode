<template>
  <div
    class="loading"
    v-loading.fullscreen.lock="showLoading"
    element-loading-text="加载中..."
    :element-loading-spinner="svg"
    element-loading-svg-view-box="-10, -10, 50, 50"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  ></div>
</template>
<script>
import { filterAsyncRoutes, sameLevelRoutes } from '@/utils/index'
export default {
  data() {
    return {
      showLoading: true,
      svg: `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `,
    }
  },
  created() {
    //是否已同步路由规则
    if (!this.$store.state.user.getIsDynamicRoute) {
      //获取用户对应菜单权限
      this.$store.dispatch('user/getUserRoutes').then(accessRoutes => {
        if (!accessRoutes || accessRoutes.length <= 0) {
          console.warn('routes must be a non-null array!')
          this.$message.error("没有分配菜单");
        }
        let routes = filterAsyncRoutes(accessRoutes)
        // 将三级及以上路由数据拍平成二级
        routes.map(item => {
          if (item.children) {
            item.children = sameLevelRoutes(item.children, [
              {
                path: item.path,
                title: item.meta ? item.meta.title : '',
              },
            ])
          }
        })
        routes.forEach(item => {
          this.$router.addRoute(item)
        })

        this.showLoading = false
        this.$router.push({ name: 'workflows' })
      })
    }
    this.$router.addRoute({
      path: '/:pathMatch(.*)*',
      redirect: '/404',
    })
  }
}
</script>