import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    // 颜色
    ['text-color', 'text-dark dark:text-white'],
    ['bg-color', 'bg-white dark:bg-dark'],
    // 布局
    ['flex-row-c-c', 'flex flex-justify-center flex-items-center'],
    ['flex-row-bt-c', 'flex flex-justify-between flex-items-center'],
    ['layout-default', 'mx-auto pt-8 pb-6 w-1400px overflow-hidden transition-300'],
  ],
  theme: {
    // ...
    colors: {
      'theme': {
        'primary': 'var(--el-color-primary)',
      }, // class="text-very-cool"
      'tip': {
        'main': 'var(--el-color-primary)', //class="--el-color-primary"
        'green': 'hsla(var(--hue, 217), 78%, 51%)', //class="bg-brand-primary"
      },
    }
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
      collections: {
        carbon: () =>
          import('@iconify-json/carbon').then((i) => i.icons as any),
        solar: () =>
          import('@iconify-json/solar').then((i) => i.icons as any)
      }
    }),
    presetTypography(),
    presetWebFonts({
      // fonts: {
      //   sans: 'DM Sans',
      //   serif: 'DM Serif Display',
      //   mono: 'DM Mono',
      // },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
