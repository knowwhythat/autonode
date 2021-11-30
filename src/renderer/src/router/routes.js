export const userRoutes = [
  {
    path: '/index',
    name: 'index',
    component: 'layout/index.vue',
    redirect: '/index/home',
    // hidden: true,
    // alwaysShow: true,
    meta: { title: '首页', icon: 'ri-home-5-fill' },
    children: [
      {
        path: 'home',
        name: 'Home',
        component: 'home/index.vue',
        meta: {
          title: '首页',
          icon: 'ri-home-5-fill',
          tabShow: true,
        },
      },
    ],
  },
  {
    path: '/workflows',
    component: 'layout/index.vue',
    meta: {
      title: '工作流',
      icon: 'ri-flow-chart',
    },
    children: [
      {
        path: 'list',
        name: 'workflows',
        component: 'workflows/index.vue',
        meta: {
          title: '工作流',
          icon: 'ri-flow-chart',
          tabShow: true,
        },
      },
      {
        path: 'detail/:id',
        name: 'ri-stack-line',
        hidden: true,
        alwaysShow: false,
        meta: {
          title: '工作流详情',
          icon: 'ri-flow-chart',
          tabShow: true,
        },
        component: 'workflows/detail.vue',
      },
    ],
  },
  {
    path: '/logs',
    component: 'layout/index.vue',
    meta: { title: '日志', icon: 'ri-file-list-line' },
    children: [
      {
        path: 'list',
        name: 'logs',
        meta: { title: '日志', icon: 'ri-file-list-line', tabShow: true },
        component: 'logs/index.vue',
      },
      {
        path: ':id',
        name: 'logs-details',
        hidden: true,
        meta: { title: '日志详情', icon: 'ri-file-mark-line', tabShow: true },
        component: 'logs/[id].vue',
      },
    ],
  },
]
