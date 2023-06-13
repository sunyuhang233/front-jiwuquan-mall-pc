import { pwa } from './config/pwa'
import { appDescription } from './constants/index'

export default defineNuxtConfig({
  alias: {
    // 配置@使用静态资源
    assets: '/<rootDir>/assets',
  },
  // 全局变量
  runtimeConfig: {
    axios: {
      baseURL:
        process.env.NODE_ENV === 'production'
          ? 'http://47.115.226.150:9090'
          : 'http://localhost:9090',
    },
  },
  app: {
    // https://nuxt.com.cn/docs/getting-started/transitions
    // layoutTransition: { name: 'layout', mode: 'out-in' }
    // pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      viewport: 'width=device-width,initial-scale=1',
      // 网站头部信息
      link: [
        { rel: 'icon', href: '/logo.png', sizes: 'any' },
        { rel: 'apple-touch-icon', href: '/logo.png' },
      ],
      // 网站meta
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: appDescription },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      ],
    },
  },
  // 模块
  modules: [
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@unocss/nuxt',
    '@vite-pwa/nuxt',
    '@nuxtjs/color-mode',
    '@element-plus/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
  ],

  experimental: {
    // when using generate, payload js assets included in sw precache manifest
    // but missing on offline, disabling extraction it until fixed
    payloadExtraction: false,
    inlineSSRStyles: false,
    renderJsonPayloads: true,
  },

  // 主题
  colorMode: {
    classSuffix: '',
  },
  // css
  css: [
    'nprogress/nprogress.css',
    '~/assets/styles/index.scss',
    '~/assets/styles/animate.scss',
    'animate.css',
  ],
  // vite css
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
          @use "@/assets/styles/element/index.scss" as element;  
          @use "@/assets/styles/element/dark.scss" as dark;  
          @use "@/assets/styles/var.scss" as *;   
          `,
        },
      },
    },
  },

  // nitro
  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    prerender: {
      crawlLinks: false,
      routes: ['/'],
    },
  },
  // elementPlus
  elementPlus: {
    icon: 'ElIcon',
    importStyle: 'scss',
    themes: ['dark'],
  },

  pwa,
  // nuxt开发者工具
  devtools: {
    enabled: false,
  },
})
