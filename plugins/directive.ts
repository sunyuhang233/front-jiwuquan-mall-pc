// @ts-ignore
import currency from "currency.js"
import { gsap } from "gsap"
import { DirectiveBinding } from "nuxt/dist/app/compat/capi"


export default defineNuxtPlugin((nuxtApp) => {
  // https://nuxt.com.cn/docs/guide/directory-structure/plugins
  nuxtApp.vueApp.directive('focus', {
    mounted(el) {
      el.focus()
    },
    getSSRProps(binding, vnode) {
      // you can provide SSR-specific props here
      return {}
    }
  })

  /**
   * 长按事件
   */
  nuxtApp.vueApp.directive("longpress", {
    mounted(el, binding) {
      let timer: NodeJS.Timeout | number;
      let start = (e: Event) => {
        if (e.type === "click") return; // 点击停止
        if (timer === null) {
          timer = setTimeout(() => {
            binding.value(e);
          }, 600);
        }
      };
      let cancel = (e: Event) => {
        if (timer !== null) {
          clearTimeout(timer);
          timer = 0;
        }
      };

      // 开始
      el.addEventListener("mousedown", start, { passive: true });
      el.addEventListener("touchstart", start, { passive: true });
      // 取消
      el.addEventListener("mouseout", cancel, { passive: true });
      el.addEventListener("touchend", cancel, { passive: true });
      el.addEventListener("click", cancel, { passive: true });
    }
  });
  /**
   * 复制文本
   */
  nuxtApp.vueApp.directive("copying", {
    mounted(el, binding) {

      el.addEventListener("click", async function (e: Event) {
        e.stopPropagation()
        const res = await useAsyncCopyText(binding.value || el.innerHTML)
        if (res && binding.modifiers.toast) {
          ElMessage.success({
            message: '成功复制至剪贴板！',
            grouping: true,
          })
        }
      }, { passive: true });


    }
  });


  /**
   * 自动递增动画 arg :参数表示持续秒数
   */
  nuxtApp.vueApp.directive('incre-up', {
    mounted: function (el, binding) {
      increNumber(el, binding)
    },
    updated: function (el, binding) {
      increNumber(el, binding)
    },
  });

  // 整数
  nuxtApp.vueApp.directive('incre-up-int', {
    mounted: function (el, binding) {
      increNumber(el, binding, true)
    },
    updated: function (el, binding) {
      increNumber(el, binding, true)
    },
  })

})

function increNumber(el: Element, binding: DirectiveBinding<any>, isInt?: boolean): void {
  const targetValue = binding.value;
  const duration = binding.arg || 1;
  const counter = { var: binding.oldValue || 0 };
  gsap.to(counter, {
    var: targetValue,
    duration: duration,
    onUpdate: function () {
      el.innerHTML = !isInt ? currency(counter.var).toString() : String(Math.ceil(counter.var));
    }
  });
}
