import { pwa } from './config/pwa'
import { appDescription } from './constants/index'
export default defineNuxtConfig({


  // 全局变量
  runtimeConfig: {
    axios: {
      baseURL:
        process.env.NODE_ENV === 'production'
          ? 'http://47.115.226.150:8082'
          : 'http://localhost:3000',
    },
  },
  app: {
    head: {
      viewport: 'width=device-width,initial-scale=1',
      // 网站头部信息
      link: [
        { rel: 'icon', href: '/favicon.svg', sizes: 'any' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
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
    'nuxt-swiper',
    '@element-plus/nuxt',
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
    "~/assets/styles/index.scss",
  ],
  // vite css
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
          @use "@/assets/styles/element/index.scss" as element;  
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
    themes: ['dark'],
    importStyle: "scss"
  },

  pwa,
  // nuxt开发者工具
  devtools: {
    enabled: true,
  },
})
