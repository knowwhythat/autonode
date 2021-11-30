import { join, resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import pkg from '../package.json'

// https://vitejs.dev/config/
export default defineConfig({
  mode: process.env.NODE_ENV,
  root: join(__dirname, '../src/renderer'),
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, '../src/renderer/src'),
      '/@': resolve(__dirname, '../src/renderer/src'),
    },
  },
  base: './',
  build: {
    emptyOutDir: true,
    outDir: '../../dist/renderer',
  },
  server: {
    host: pkg.env.HOST,
    port: pkg.env.PORT,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "../src/renderer/src/assets/style/element-variables.scss";`,
        //引用公共样式，使用vite搭建项目只安装sass即可，不需要安装node-sass,sass-loader
      },
    },
  },
})
