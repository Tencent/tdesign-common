/* eslint-disable no-param-reassign */
import { UploadFile, SizeLimitObj, FileChangeParams, FileChangeReturn, RequestMethodResponse, HandleUploadReturn, HandleUploadParams, FormatResponseContext, SuccessContext, handleSuccessParams } from './types';
import { isOverSizeLimit } from './utils';
import xhr from './xhr';
import log from '../log/log';

export interface BeforeUploadExtra {
  /** 图片文件大小限制 */
  sizeLimit?: number | SizeLimitObj;
  /** 上传文件之前的钩子，参数为上传的文件，返回值决定是否上传 */
  beforeUpload?: (file: UploadFile) => boolean | Promise<boolean>;
}

export type BeforeUploadPromiseList = [Promise<SizeLimitObj>, undefined | Promise<boolean>]

export function handleBeforeUpload(
  file: UploadFile, params: BeforeUploadExtra,
): Promise<[SizeLimitObj, boolean]> {
  const { sizeLimit, beforeUpload } = params;
  // 文件大小校验
  const sizePromise = new Promise<SizeLimitObj>((resolve) => {
    let result: SizeLimitObj = null;
    if (sizeLimit) {
      const sizeLimitObj: SizeLimitObj = typeof sizeLimit === 'number'
        ? { size: sizeLimit, unit: 'KB' }
        : sizeLimit;
      const limit = isOverSizeLimit(file.size / 1024, sizeLimitObj.size, sizeLimitObj.unit);
      if (limit) {
        result = sizeLimitObj;
      }
    }
    resolve(result);
  });

  // 自定义校验
  const promiseList: BeforeUploadPromiseList = [sizePromise, undefined];
  if (typeof beforeUpload === 'function') {
    const r = beforeUpload(file);
    const p = r instanceof Promise ? r : (new Promise<boolean>((resolve) => resolve(r)));
    promiseList[1] = p;
  }

  // 同时进行文件大小校验和自定义校验函数
  return new Promise((resolve) => {
    Promise.all(promiseList).then((r) => {
      resolve(r);
    });
  });
}

export interface OnErrorParams {
  event?: ProgressEvent;
  files: UploadFile[];
  response?: any;
  formatResponse?: HandleUploadParams['formatResponse'];
}

export function handleError(options: OnErrorParams) {
  const { event, files, response, formatResponse } = options;
  files.forEach((file) => {
    file.status = 'fail';
  });
  let res = response;
  if (typeof formatResponse === 'function') {
    res = formatResponse(response, { file: files[0], currentFiles: files });
  }
  return { response: res, event, files };
}

export function handleSuccess(params: handleSuccessParams) {
  const { event, files, response, formatResponse } = params;
  if (files?.length <= 0) {
    log.error('Upload', 'Empty File in Success Callback');
  }
  files.forEach((file) => {
    file.status = 'success';
  });
  let res = response;
  files[0].url = res.url || files[0].url;
  if (typeof formatResponse === 'function') {
    res = formatResponse(response, {
      file: files[0],
      currentFiles: files,
    });
  }
  return { response: res, event, files };
}

export type UploadRequestReturn = {
  status?: 'fail' | 'success';
  data?: SuccessContext;
  list?: UploadRequestReturn[];
}

/**
 * 一次上传请求的返回结果
 */
export function uploadOneRequest(params: HandleUploadParams): Promise<UploadRequestReturn> {
  const { action, toUploadFiles, requestMethod } = params;
  return new Promise<UploadRequestReturn>((resolve) => {
    if (!action && !requestMethod) {
      log.error('Upload', 'one of action and requestMethod must be exist.');
      resolve({});
      return;
    }
    if (!toUploadFiles || !toUploadFiles.length) {
      log.warn('Upload', 'No files need to be uploaded');
      resolve({});
      return;
    }
    toUploadFiles.forEach((file) => {
      file.status = 'progress';
    });
    if (requestMethod) {
      requestMethod(toUploadFiles).then((res) => {
        const r = {
          response: res.response,
          file: toUploadFiles[0],
          files: toUploadFiles,
        };
        if (res.status === 'success') {
          params.onResponseSuccess?.(r);
        } else if (res.status === 'fail') {
          params.onResponseError?.(r);
        }
        resolve({
          status: res.status,
          data: r,
        });
      });
    } else {
      const xhrReq = xhr({
        action: params.action,
        files: params.toUploadFiles,
        onError: (p: OnErrorParams) => {
          const r = handleError({ ...p, formatResponse: params.formatResponse });
          params.onResponseError?.(r);
          resolve({ status: 'fail', data: r });
        },
        onProgress: params.onResponseProgress,
        onSuccess: (p: SuccessContext) => {
          const r = handleSuccess({ ...p, formatResponse: params.formatResponse });
          params.onResponseSuccess?.(r);
          resolve({ status: 'success', data: r });
        },
        data: params.data,
        name: params.name,
        headers: params.headers,
        withCredentials: params.withCredentials,
        method: params.method,
      });
      params.setXhrObject?.(xhrReq);
    }
  });
}

/**
 * 可能单个文件上传，也可能批量文件一次性上传
 * 返回上传成功或上传失败的文件列表
 */
export function upload(params: HandleUploadParams):
Promise<UploadRequestReturn> {
  const { uploadAllFilesInOneRequest, toUploadFiles, uploadedFiles, isBatchUpload } = params;
  return new Promise((resolve) => {
    // 所有文件一次性上传
    if (uploadAllFilesInOneRequest) {
      uploadOneRequest(params).then((r) => {
        if (r.status === 'success') {
          r.data.files = isBatchUpload ? toUploadFiles : uploadedFiles.concat(toUploadFiles);
        }
        resolve(r);
      });
      return;
    }
    // 一个文件一个文件上传
    const list = toUploadFiles.map((file) => (
      uploadOneRequest({ ...params, toUploadFiles: [file] })
    ));
    Promise.all(list).then((arr) => {
      const files: UploadFile[] = [];
      arr.forEach((one) => {
        if (one.status === 'success') {
          files.push(one.data.files[0]);
        }
      });
      const newFiles = isBatchUpload ? files : uploadedFiles.concat(files);
      resolve({
        // 有一个请求成功，就算成功
        status: files.length ? 'success' : 'fail',
        data: {
          files: newFiles,
        },
        list: arr,
      });
    });
  });
}

export function formatToUploadFile(tmpFiles: File[], format: FileChangeParams['format']) {
  return tmpFiles.map((fileRaw: File) => {
    let file: UploadFile = fileRaw;
    if (typeof format === 'function') {
      file = format(fileRaw);
    }
    const uploadFile: UploadFile = {
      raw: fileRaw,
      lastModified: fileRaw.lastModified,
      name: fileRaw.name,
      size: fileRaw.size,
      type: fileRaw.type,
      percent: 0,
      status: 'waiting',
      ...file,
    };
    return uploadFile;
  });
}

export function validateFile(
  params: FileChangeParams
): Promise<FileChangeReturn> {
  const { files, uploadValue, max, allowUploadDuplicateFile } = params;
  return new Promise((resolve) => {
    // 是否允许相同的文件名存在
    let tmpFiles = files.filter((file) => {
      const sameNameFile = uploadValue.find((t) => t.name === file.name);
      return allowUploadDuplicateFile || !sameNameFile;
    });
    // 上传文件数量限制
    let lengthOverLimit = false;
    if (max) {
      tmpFiles = tmpFiles.slice(0, max - uploadValue.length);
      if (tmpFiles.length !== files.length) {
        lengthOverLimit = true;
      }
    }

    // 格式化文件对象
    const formattedFiles = formatToUploadFile(tmpFiles, params.format);

    // 全量文件，一波校验，整体上传 或 终止上传
    let allFileValidatePromise;
    if (params.beforeAllFilesUpload) {
      const r = params.beforeAllFilesUpload?.(formattedFiles);
      allFileValidatePromise = r instanceof Promise ? r : new Promise((resolve) => resolve(r));
    }

    // 单文件合法性校验，一个文件校验不通过其他文件可继续上传
    const promiseList = formattedFiles.map((file: UploadFile) => handleBeforeUpload(
      file,
      { beforeUpload: params.beforeUpload, sizeLimit: params.sizeLimit },
    ).then(([sizeResult, customResult]) => {
      if (sizeResult) {
        resolve({ validateResult: { type: 'FILE_OVER_SIZE_LIMIT', extra: sizeResult } });
      } else if (!customResult) {
        resolve({ validateResult: { type: 'CUSTOME_BEFORE_UPLOAD' } });
      }
      resolve({ file });
    }));

    Promise.all([allFileValidatePromise].concat(promiseList)).then((results) => {
      const [allFilesResult, ...others] = results;
      if (allFilesResult === false) {
        resolve({ lengthOverLimit, validateResult: { type: 'BEFORE_ALL_FILES_UPLOAD' } });
      }
      resolve({
        lengthOverLimit,
        fileValidateList: others,
      });
    });
  });
}

export function getFilesAndErrors(fileValidateList: FileChangeReturn[]) {
  const errors: FileChangeReturn['validateResult'][] = [];
  const toFiles: UploadFile[] = [];
  fileValidateList.forEach((oneFile) => {
    if (oneFile.validateResult?.type === 'CUSTOME_BEFORE_UPLOAD') return;
    if (oneFile.validateResult?.type === 'FILE_OVER_SIZE_LIMIT') {
      errors.push(oneFile.validateResult);
      return;
    }
    toFiles.push(oneFile.file);
  });

  return { errors, toFiles, firstError: errors[0] };
}
