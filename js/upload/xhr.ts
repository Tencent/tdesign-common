/* eslint-disable no-param-reassign */
import log from '../log/log';
import { UploadFile, XhrOptions } from './types';
import { getCurrentDate } from './utils';

export default function xhr({
  method = 'POST',
  action,
  withCredentials = false,
  headers = {},
  data = {},
  file,
  files = [],
  name = 'file',
  useMockProgress = true,
  formatRequest,
  onError,
  onProgress,
  onSuccess,
}: XhrOptions) {
  // support files
  const innerFiles: UploadFile[] = files || [];
  let percent = 0;

  // eslint-disable-next-line no-shadow
  const xhr = new XMLHttpRequest();
  if (withCredentials) {
    xhr.withCredentials = true;
  }

  let timer1: NodeJS.Timeout;
  let timer2: NodeJS.Timeout;
  if (useMockProgress && files[0]?.status === 'progress') {
    // 超过 500 毫秒再开启虚拟进度
    const timer2 = setTimeout(() => {
      // 只有真实进度一直不存在时才需要模拟进度
      timer1 = setInterval(() => {
        if (percent + 10 < 100) {
          percent = Math.max(percent + 10, percent);
          if (files[0] && percent !== files[0].percent) {
            files[0].percent = percent;
            onProgress({
              percent,
              file: file || innerFiles[0],
              files: innerFiles.map((file) => ({ ...file, percent })),
              type: 'mock',
              XMLHttpRequest: xhr,
            });
          }
        } else {
          clearInterval(timer1);
        }
      }, 300);
      clearTimeout(timer2);
    }, 300);
  }

  let requestData: { [key: string]: any } = {};
  if (data) {
    const extraData = typeof data === 'function' ? data(file) : data;
    Object.assign(requestData, extraData);
  }
  innerFiles.forEach((file, index) => {
    const fileField = innerFiles.length > 1 ? `${name}[${index}]` : name;
    requestData[fileField] = file.raw;
    requestData[name] = file.raw;
  });

  if (formatRequest) {
    requestData = formatRequest(requestData);
  }

  // set send data
  const formData = new FormData();
  Object.keys(requestData).forEach((key) => {
    formData.append(key, requestData[key]);
  });

  xhr.open(method, action, true);
  // custom request headers
  Object.keys(headers).forEach((key) => {
    xhr.setRequestHeader(key, headers[key]);
  });

  xhr.onerror = (event: ProgressEvent) => {
    onError({ event, file, files: innerFiles });
    clearInterval(timer1);
    clearTimeout(timer2);
  };

  if (xhr.upload) {
    xhr.upload.onprogress = (event: ProgressEvent) => {
      let realPercent = 0;
      if (event.total > 0) {
        realPercent = Math.round((event.loaded / event.total) * 100);
      }
      percent = Math.max(realPercent, percent);
      if (percent !== realPercent && innerFiles[0]?.percent !== percent) {
        const progressFiles = innerFiles.map((item) => ({ ...item, percent }));
        onProgress({
          event,
          percent,
          file: file || progressFiles[0],
          files: progressFiles,
          type: 'real',
          XMLHttpRequest: xhr,
        });
      }
    };
  }

  // eslint-disable-next-line consistent-return
  xhr.onload = (event: ProgressEvent) => {
    let response: { [key: string]: any } = {};
    response.XMLHttpRequest = xhr;
    const isFail = xhr.status < 200 || xhr.status >= 300;
    if (isFail) {
      return onError({
        event, file, files: innerFiles, response
      });
    }
    const text = xhr.responseText || xhr.response;
    try {
      response = JSON.parse(text);
    } catch (e) {
      response = text;
      log.error('Upload', 'response does not a valid json');
    }
    clearInterval(timer1);
    clearTimeout(timer2);
    innerFiles.forEach((file) => {
      file.percent = 100;
      file.status = 'success';
      // 如果上传请求返回结果没有上传日期，则使用电脑当前日期显示
      file.uploadTime = response?.uploadTime || getCurrentDate();
    });
    if (typeof response === 'object') {
      response.XMLHttpRequest = xhr;
    }
    onSuccess({
      event,
      file: file || innerFiles[0],
      files: [...innerFiles],
      response,
    });
  };

  xhr.send(formData);

  return xhr;
}
