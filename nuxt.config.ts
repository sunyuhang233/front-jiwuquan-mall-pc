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
          ? import.meta.env.VITE_APP_PROD_BASE_URL
          : import.meta.env.VITE_APP_DEV_BASE_URL,
    },
  },
  app: {
    // https://nuxt.com.cn/docs/getting-started/transitions
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
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
    '@unocss/nuxt',
    '@vite-pwa/nuxt',
    '@nuxtjs/color-mode',
    '@element-plus/nuxt',
    'nuxt-lodash',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt'
  ],
  experimental: {
    payloadExtraction: false,
    inlineSSRStyles: false,
    renderJsonPayloads: true,
  },
  // 自动导入
  imports: {
    dirs: [
      // Scan top-level modules
      'composables',
      'composables/utils/**',
      'composables/store/**',
      'types',
      'types/*/.ts',
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
    server: {
      proxy: {
        // 接口地址代理
        '/api': {
          target: 'http://47.115.226.150:9090', // 接口的域名
          secure: false, // 如果是https接口，需要配置这个参数
          changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
          rewrite: path => path.replace(/^\/api/, '')
        },
      }
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
    storage: 'sessionStorage',
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
    devProxy: {
      "/api": {
        target: "http://47.115.226.150:9090",
        prependPath: true,
        changeOrigin: true,
      }
    }
  },
  // elementPlus
  elementPlus: {
    icon: 'ElIcon',
    importStyle: 'scss',
    themes: ['dark'],
  },
  // 断网启动
  pwa,
  // nuxt开发者工具
  devtools: {
    enabled: false,
  }
})
