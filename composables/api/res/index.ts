import * as qiniu from 'qiniu-js';
import type { Config, Extra, UploadProgress } from 'qiniu-js/esm/upload/base';
import type { PartialObserver } from 'qiniu-js/esm/utils/observable';
import { Result } from 'types/result';
/**
 * @param file 上传文件
 * @param fileName 目标文件名
 * @param token 上传凭证
 * @param putExtra 上传文件的相关资源信息配置
 * @param config 上传任务的配置
 * @returns 返回用于上传任务的可观察对象
 */
export const uploadOssFile = (file: File, fileName: string | null = null, token: string, observer: PartialObserver<UploadProgress, qiniu.QiniuError | qiniu.QiniuRequestError | qiniu.QiniuNetworkError, any>,
  putExtra?: Partial<Extra>, config?: Config) => {
  const observable = qiniu.upload(file,
    fileName,
    token,
    putExtra,
    config)
  return observable.subscribe(observer) // 上传开始
}

/**
 * 获取上传临时凭证token（图片）
 * @param fileType 文件类型
 * @param token 用户token
 * @returns 
 */
export const getResToken = (fileType: OssFileType, token: string) => {
  return useHttp.get<Result<ResOssVO>>(`/res/user/${fileType}`, {}, {
    headers: {
      Authorization: token
    }
  })
}
/**
 * 删除oss文件
 * @param key 文件名 
 * @param token 用户token
 * @returns 
 */
export const deleteOssFile = (key: string, token: string) => {
  return useHttp.deleted<Result<string>>(`/res/user/files?key=${key}`, {
  }, {
    headers: {
      Authorization: token
    }
  })
}

export enum OssFileType {
  IMAGE = "image",
  VIDEO = "video",
  FILE = "file",
  FONT = "font",
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