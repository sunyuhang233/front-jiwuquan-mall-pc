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
    start_url: ".",
    display: "standalone",
    name: appName,
    short_name: appName,
    description: appDescription,
    theme_color: '#000000',
    icons: [
      {
        src: './logo.png',
        sizes: '436x436',
        type: 'image/png',
      }
    ],
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,txt,png,ico,svg}'],
    navigateFallbackDenylist: [/^\/api\//],
    navigateFallback: '/',

    cleanupOutdatedCaches: true,
    runtimeCaching: [
    ],
  },
  registerWebManifestInRouteRules: true,
  writePlugin: true,
  devOptions: {
    enabled: process.env.VITE_PLUGIN_PWA === 'true',
    navigateFallback: scope,
  },
  // related_applications: [
  //   {
  //     platform: "web"
  //   },
  //   {
  //     platform: "play",
  //     url: "https://play.google.com/store/apps/details?id=cheeaun.hackerweb"
  //   }
  // ]
}
