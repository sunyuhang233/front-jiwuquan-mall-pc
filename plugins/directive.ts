import { gsap } from "gsap"
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
  nuxtApp.vueApp.directive("longpress", function (el, binding) {
    let timer: NodeJS.Timeout | number;
    let start = (e: Event) => {
      e.preventDefault();
      if (e.type === "click") return; // 点击停止
      if (timer === null) {
        timer = setTimeout(() => {
          binding.value(e);
        }, 600);
      }
    };
    let cancel = (e: Event) => {
      e.preventDefault();
      if (timer !== null) {
        clearTimeout(timer);
        timer = 0;
      }
    };

    // 开始
    el.addEventListener("mousedown", start);
    el.addEventListener("touchstart", start);
    // 取消
    el.addEventListener("mouseout", cancel);
    el.addEventListener("touchend", cancel);
    el.addEventListener("click", cancel);
  });
  /**
   * 复制文本
   */
  nuxtApp.vueApp.directive("copying", function (el, binding) {
    el.addEventListener("click", async function (e: Event) {
      e.preventDefault()
      e.stopPropagation()
      const res = await useAsyncCopyText(binding.value || el.innerHTML)
      if (res) {
        ElMessage.success({
          message: '成功复制至剪贴板！',
          grouping: true,
        })
      }
    });
  });


  /**
   * 自动递增动画 arg :参数表示持续秒数
   */
  nuxtApp.vueApp.directive('incre-up', {
    mounted: function (el, binding) { 
      const targetValue = binding.value;
      const duration = binding.arg || 1;
      const counter = { var: binding.oldValue||0 };
      gsap.to(counter, {
        var: targetValue,
        duration: duration,
        onUpdate: function () {
          el.innerHTML = Math.ceil(counter.var).toFixed(2);
        }
      });
    },
    updated: function (el, binding) { 
      const targetValue = binding.value;
      const duration = binding.arg || 1;
      const counter = { var: binding.oldValue||0 };
      gsap.to(counter, {
        var: targetValue,
        duration: duration,
        onUpdate: function () {
          el.innerHTML = Math.ceil(counter.var).toFixed(2);
        }
      });
    }
  })


  nuxtApp.vueApp.directive('cart-pool', {
    mounted: function (el, binding) {
    }
  })

})