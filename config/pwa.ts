import type { ModuleOptions } from '@vite-pwa/nuxt'
import { appDescription, appName } from '../constants/index'

const scope = '/'
export const pwa: ModuleOptions = {
  registerType: 'autoUpdate',
  scope,
  base: scope,
  // https://developer.mozilla.org/zh-CN/docs/Web/Manifest#lang
  manifest: {
    id: scope,
    scope,
    background_color: "#fff",
    display: "standalone",
    name: appName,
    short_name: appName,
    description: appDescription,
    theme_color: '#5d33f6',
    icons: [
      {
        src: 'logo.png',
        sizes: 'any',
        type: 'image/png',
        purpose: 'any'
      }
    ],
    related_applications: [
      {
        platform: "play",
        url: "https://play.google.com/store/apps/details?id=cheeaun.hackerweb"
      }
    ]
  },
  workbox: {
    globPatterns: ['**/*.{css,js,html,svg,png,ico,txt,ttf,woff,woff2}'],
    runtimeCaching: [
      {
        urlPattern: "/^https://fonts.googleapis.com/.* /i",
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 60 // <== 365 days
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      },
    ]
  },
  registerWebManifestInRouteRules: true,
  writePlugin: true,
  devOptions: {
    enabled: true,
  },

}
