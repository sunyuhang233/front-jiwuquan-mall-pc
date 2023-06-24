// @ts-ignore
import VMdPreviewHtml from '@kangc/v-md-editor';
export default defineNuxtPlugin((nuxtApp) => {

  nuxtApp.vueApp.use(VMdPreviewHtml).component("VMdPreviewHtml",VMdPreviewHtml);
})