export function useCheckXXSText(text: string): string {
  //  https://github.com/leizongmin/js-xss/blob/master/README.zh.md
  text = text
    .replace(/(<br[^>]*>| |\s*)/g, "")
    .replace(/\&/g, "&amp;")
    .replace(/\"/g, "&quot;")
    .replace(/\'/g, "&#39;")
    .replace(/\</g, "&lt;")
    .replace(/\>/g, "&gt;");
  return text;
}
/**
 * 通过积分 计算等级
 * @param ponits 积分
 * @returns
 */
export function getUserLeave(ponits: number = 0): number {
  let leave = 0;
  if (ponits > 0 && ponits < 3000)
    leave = 0;
  else if (ponits < 10000)
    leave = 1;
  else if (ponits < 20000)
    leave = 1;
  else if (ponits < 30000)
    leave = 3;
  else if (ponits < 40000)
    leave = 4;
  else if (ponits < 50000)
    leave = 5;
  else
    leave = 6;

  return leave;
}
/**
 * 根据所给日期获取当月的第一天和最后一天
 * @param date
 * @returns
 */
export function getMonthStartEnd(date: Date = new Date()): Date[] {
  return [new Date(date.getFullYear(), date.getMonth(), 0), new Date(date.getFullYear(), date.getMonth() + 1, 0)];
};
/**
 * 获取开始时间
 * @param date
 * @returns
 */
export function getDayStartEnd(date: Date = new Date()): Date[] {
  return [new Date(date.getFullYear(), date.getMonth(), date.getDay()), new Date(date.getFullYear(), date.getMonth(), date.getDay() + 1)];
};


/**
 * 复制文字
 * @param text 复制的文本
 * @returns
 */
export function useCopyText(text: string) {
  // 动态创建 textarea 标签
  const textarea: HTMLTextAreaElement = document.createElement("textarea");
  // 将该 textarea 设为 readonly 防止 iOS 下自动唤起键盘，同时将 textarea 移出可视区域
  textarea.readOnly = true;
  textarea.style.position = "absolute";
  textarea.style.opacity = "0";
  textarea.style.left = "-500px";
  // 将要 copy 的值赋给 textarea 标签的 value 属性
  textarea.value = text;
  // 将 textarea 插入到 body 中
  document.body.appendChild(textarea);
  // 选中值并复制
  textarea.select();
  const result = document.execCommand("Copy");
  document.body.removeChild(textarea);
  return result;
}
/**
 *
 * 复制文本（异步）
 * @param text 复制的文本
 * @returns promise
 */
export function useAsyncCopyText(text: string): Promise<boolean> {
  // 新语法
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
    return Promise.resolve(true);
  }
  else {
    // 兼容移动端版本
    return new Promise((resolve, reject) => {
      if (useCopyText(text))
        return resolve(true);
      else
        return reject(false);
    });
  }
}
