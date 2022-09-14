import { UploadFile, XhrOptions } from './types';

export default function xhr({
  method = 'POST',
  action,
  withCredentials = false,
  headers = {},
  data = {},
  file,
  files,
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
  if (useMockProgress && files[0].status === 'progress') {
    // 超过 500 毫秒再开启虚拟进度
    const timer2 = setTimeout(() => {
      // 只有真实进度一直不存在时才需要模拟进度
      timer1 = setInterval(() => {
        if (!percent && percent < 100) {
          percent += 10;
          onProgress({
            percent,
            file,
            files: innerFiles.map((file) => ({ ...file, percent })),
            type: 'mock',
          });
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
      onProgress({
        event,
        percent,
        file,
        files: innerFiles.map((file) => ({ ...file, percent })),
        type: 'real',
      });
    };
  }

  // eslint-disable-next-line consistent-return
  xhr.onload = (event: ProgressEvent) => {
    let response;
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
    }
    clearInterval(timer1);
    clearTimeout(timer2);
    onSuccess({
      event, file, files: innerFiles, response
    });
  };

  xhr.send(formData);

  return xhr;
}
