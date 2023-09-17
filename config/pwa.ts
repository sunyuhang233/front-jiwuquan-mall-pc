import type { ModuleOptions } from "@vite-pwa/nuxt";
import { appDescription, appName } from "../constants/index";

const scope = "/";
export const pwa: ModuleOptions = {
  registerType: "autoUpdate",
  scope,
  base: scope,
  display: "standalone",
  includeAssets: ["logo.png"],
  // https://developer.mozilla.org/zh-CN/docs/Web/Manifest#lang
  manifest: {
    background_color: "#fff",
    display: "standalone",
    name: appName,
    short_name: appName,
    start_url: scope,
    description: appDescription,
    theme_color: "#5d33f6",
    icons: [
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable ",
      },
      { purpose: "any", sizes: "192x192", src: "glowing_star.svg", type: "image/svg+xml" },
    ],
    // related_applications: [
    // {
    //   platform: "play",
    //   url: "https://play.google.com/store/apps/details?id=cheeaun.hackerweb"
    // }
    // ],
  },
  workbox: {
    globPatterns: ["**/*.{css,js,html,svg,png,woff,woff2}"],
    runtimeCaching: [
      {
        urlPattern: "/^https://quang.kiwi2333.top/font/* /i",
        handler: "CacheFirst",
        options: {
          cacheName: "jiwuquan-fonts-cache",
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 31, // <== 365 days
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  },
  registerWebManifestInRouteRules: true,
  writePlugin: true,
  devOptions: {
    enabled: true,
  },
};
