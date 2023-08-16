import * as qiniu from 'qiniu-js';
import { Config, Extra, UploadProgress } from 'qiniu-js/esm/upload/base';
import { PartialObserver } from 'qiniu-js/esm/utils/observable';
import { Result } from 'types/result';
/**
 * @param file 上传文件
 * @param fileName 目标文件名
 * @param token 上传凭证
 * @param putExtra 上传文件的相关资源信息配置
 * @param config 上传任务的配置
 * @returns 返回用于上传任务的可观察对象
 */
export const defUpload = (file: File, fileName: string | null = null, token: string, observer: PartialObserver<UploadProgress, qiniu.QiniuError | qiniu.QiniuRequestError | qiniu.QiniuNetworkError, any>,
  putExtra?: Partial<Extra>, config?: Config) => {
  const observable = qiniu.upload(file,
    fileName,
    token,
    putExtra,
    config)
  return observable.subscribe(observer) // 上传开始
}

/**
 * 获取上传临时凭证token
 * @param token 用户token
 * @returns 
 */
export const getResToken = (token: string) => {
  return useHttp.get<Result<ResOssVO>>("/res/user/image", {}, {
    headers: {
      Authorization: token
    }
  })
}
/**
 * oss上传临时凭证VO
 */
export interface ResOssVO {
  url: string;
  key: string;
  uploadToken: string;
  endDateTime: number;
}