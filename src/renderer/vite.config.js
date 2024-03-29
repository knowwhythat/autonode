import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
const { resolve } = require('path')
/**
 * @type {import('vite').UserConfig}
 */
export default defineConfig(({ command, mode }) => {
  let vueI18n = {}
  if (command === 'serve') {
    vueI18n['vue-i18n'] = 'vue-i18n/dist/vue-i18n.cjs.js' //解决dev运行警告You are running the esm-bundler build of vue-i18n.
  }
  return {
    plugins: [
      vue(),
      Components({
        // resolvers: [ElementPlusResolver()],
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '/@': resolve(__dirname, 'src'),
        ...vueI18n,
      },
    },
    base: './',
    server: {
      host: '127.0.0.1',
      port: 3000,
      open: false,
      // 反向代理
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:80/',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "./src/style/element-variables.scss";`,
          //引用公共样式，使用vite搭建项目只安装sass即可，不需要安装node-sass,sass-loader
        },
      },
    },
  }
})
