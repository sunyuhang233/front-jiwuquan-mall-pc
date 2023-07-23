// import { BaseUrl } from './composables/utils/useFetchUtil'
// import { pwa } from './config/pwa'
import { appDescription } from './constants/index'

export default defineNuxtConfig({
  build: {
    transpile: [/echarts/],
  },
  // 模块
  modules: [
    // 基础
    '@unocss/nuxt',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    // UI
    '@element-plus/nuxt',
    'nuxt-swiper',
    // 工具
    '@vueuse/nuxt',
  ],
  alias: {
    // 配置@使用静态资源
    assets: '/<rootDir>/assets',
  },
  // 全局变量
  runtimeConfig: {
  },
  app: {
    // https://nuxt.com.cn/docs/getting-started/transitions
    // pageTransition: { name: 'page', mode: 'out-in' },
    // layoutTransition: { name: 'layout', mode: 'out-in' },
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

  experimental: {
    payloadExtraction: false,
    inlineSSRStyles: false,
    renderJsonPayloads: true,// 
    viewTransition: true,// 支持View Transition API Chorme111 https://blog.csdn.net/weixin_42553583/article/details/130474259
    crossOriginPrefetch: true, //使用 Speculation Rules API 启用跨源预取。
  },
  // 自动导入
  imports: {
    dirs: [
      // Scan top-level modules
      'composables',
      'composables/utils/**',
      'composables/store/**',
      'types/*/.ts',
      'types/**',
    ]
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
  // vite 
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
  // pinia
  pinia: {
    autoImports: [
      'defineStore', // import { defineStore } from 'pinia',
    ],
  },

  // pinia持久化到会话存储
  piniaPersistedstate: {
    storage: "localStorage",
  },

  // nitro
  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    // devServer: {
    //   url: BaseUrl
    // },
    // devProxy: {
    //   "/api": {
    //     target: BaseUrl,
    //     prependPath: true,
    //     changeOrigin: true,
    //   }
    // }
  },
  // elementPlus
  elementPlus: {
    icon: 'ElIcon',
    importStyle: 'scss',
    themes: ['dark'],
  },
  // 断网启动
  // pwa
  // nuxt开发者工具
  devtools: {
    enabled: false,
  }
})
