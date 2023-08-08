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
    ['v-btn', 'border-0 rounded-4px'],
    ['v-btn-primary', 'border-0 rounded-4px bg-[var(--el-color-primary)] text-white'],
    // 颜色
    ['text-color', 'text-dark dark:text-white'],
    ['bg-color', 'bg-white dark:bg-dark'],
    // 边框
    ['border-default', 'border-1px border-solid border-gray-200 dark:border-dark-300'],
    ['border-default-dashed', 'hover:shadow-sm border-2px  border-default border-dashed'],
    ['border-default-hover', `transition-300 hover:shadow hover:border-solid hover:border-[var(--el-color-primary)]  border-default-dashed
    `],
    // 布局
    ['flex-row-c-c', 'flex flex-row flex-justify-center flex-items-center'],
    ['flex-row-bt-c', 'flex flex-row flex-justify-between flex-items-center'],
    ['layout-default', 'mx-a sm:px-2rem md:px-0 py-6 w-86vw md:w-1400px'],
    ['layout-default-se', 'mx-a sm:px-2rem md:px-0 py-6 w-86vw md:w-1000px'],
    ['absolute-center', 'absolute left-1/2 -translate-x-1/2'],
    ['absolute-center-center', 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'],
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
