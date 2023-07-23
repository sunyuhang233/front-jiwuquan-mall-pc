// @ts-ignore
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
// @ts-ignore 
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
// @ts-ignore 
import hljs from 'highlight.js';// highlightjs
// 引入icon
export default defineNuxtPlugin(async (NuxtApp) => {
  // 配置markdown
  VMdPreview.use(vuepressTheme, {
    Hljs: hljs,
  });
  NuxtApp.vueApp.use(VMdPreview);
});
