// @ts-ignore
import SHA256 from 'crypto-js/sha256';// Encrypt
// @ts-ignore
import cryptojs from 'crypto-js';// Encrypt

/**
 * 
 * @param data 加密内容
 * @param key 盐值
 * @returns 
 */
class CryptoJS {
  /**
   * 加密
   * @param data
   * @param key 
   * @returns 
   */
  public encrypt = (data: string | object, key: string) => {
    if (data instanceof Object) {
      data = JSON.stringify(data);
    }
    return SHA256.encrypt(data, key).toString();
  }
  /**
   * 解密
   * @param data
   * @param key 
   * @returns 
   */
  public decrypt = (encryptStr: string, key: string) => {
    try {
      return JSON.parse(SHA256.decrypt(encryptStr, key).toString(cryptojs.enc.Utf8));
    } catch (e) {
      console.warn("解密失败，", e);
    }
  }
}

export const useCrypto = new CryptoJS();