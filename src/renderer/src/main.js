import { createApp } from 'vue'
import App from '@/App.vue'
import { init } from '@/utils/ipc'
import router from '@/router'
import store from '@/store'
import ElementPlus from 'element-plus'
import '@/assets/style/common.css'

createApp(App).use(router).use(store).use(ElementPlus).mount('#app').$nextTick(init(store))
