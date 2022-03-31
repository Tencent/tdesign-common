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
  onError,
  onProgress,
  onSuccess,
}: XhrOptions) {
  // support files
  const innerFiles: UploadFile[] = files || [];

  // eslint-disable-next-line no-shadow
  const xhr = new XMLHttpRequest();
  if (withCredentials) {
    xhr.withCredentials = true;
  }

  // set send data
  const formData = new FormData();
  const sendData = typeof data === 'function' ? data(file) : data;
  Object.keys(sendData).forEach((key) => {
    formData.append(key, data[key]);
  });

  // support one request upload multiple files
  innerFiles.forEach((f) => {
    formData.append(name, f && f.raw as any);
  });

  xhr.open(method, action, true);

  // custom request headers
  Object.keys(headers).forEach((key) => {
    xhr.setRequestHeader(key, headers[key]);
  });

  xhr.onerror = (event: ProgressEvent) => onError({ event, file, files: innerFiles });

  if (xhr.upload) {
    xhr.upload.onprogress = (event: ProgressEvent) => {
      let percent = 0;
      if (event.total > 0) {
        percent = Math.round((event.loaded / event.total) * 100);
      }

      onProgress({
        event, percent, file, files: innerFiles
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
    onSuccess({
      event, file, files: innerFiles, response
    });
  };

  xhr.send(formData);

  return xhr;
}
