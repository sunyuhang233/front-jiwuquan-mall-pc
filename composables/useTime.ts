export const useNowDateText = (date:Date):string=> {
  const hours = new Date().getHours();
  let res: string = ""
  if (hours > 0) {
    res = "凌晨"
  } else if (hours < 12) {
    res = "早上"
  } else if (hours === 12) {
    res = "中午"
  } else if (hours > 12) {
    res = "下午"
  } {
    res = "晚上"
  }
  return res
}