import { pwa } from './config/pwa'
import { appDescription } from './constants/index'
export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@vite-pwa/nuxt',
    '@element-plus/nuxt',
    "nuxt-swiper",
  ],
  // 全局变量
  runtimeConfig: {
    axios: {
      baseURL:
        process.env.NODE_ENV === "production"
          ? "http://47.115.226.150:8082"
          : "http://localhost:3000",
    },
  },

  experimental: {
    // when using generate, payload js assets included in sw precache manifest
    // but missing on offline, disabling extraction it until fixed
    payloadExtraction: false,
    inlineSSRStyles: false,
    renderJsonPayloads: true,
  },

  app: {
    head: {
      viewport: 'width=device-width,initial-scale=1',
      link: [
        { rel: 'icon', href: '/favicon.svg', sizes: 'any' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: appDescription },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      ],
    },
  },

  // 重设css
  css: [
  ],

  colorMode: {
    classSuffix: '',
  },

  // elementPlus
  elementPlus: {
  },


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

  pwa,
  // nuxt开发者工具
  devtools: {
    enabled: true,
  },
})
