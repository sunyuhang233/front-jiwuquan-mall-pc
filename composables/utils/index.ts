export function useCheckXXSText(text: string): string {
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
 * 获取本地位置
 * @returns
 */
export const useGetPosition = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          let latitude = position.coords.latitude;
          let longitude = position.coords.longitude;
          let data = {
            latitude: latitude,
            longitude: longitude,
          };
          resolve(data);
        },
        function () {
          reject(arguments);
        }
      );
    } else {
      reject("你的浏览器不支持当前地理位置信息获取");
    }
  });
};


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
 * 复制文本
 * @param text 复制的文本
 * @returns promise
 */
export function useAsyncCopyText(text: string): Promise<boolean | void> {
  // 新语法
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  } else {
    // 兼容移动端版本
    return new Promise((res, rej) => {
      if (useCopyText(text)) {
        return res(true);
      } else {
        return rej(false);
      }
    });
  }

}