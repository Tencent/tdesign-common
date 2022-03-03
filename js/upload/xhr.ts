import { XhrOptions } from './types';

export default function xhr({
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
  const innerFiles = Array.isArray(files) ? files : [file];

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
    formData.append(name, f.raw);
  });

  xhr.open('post', action, true);

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

      innerFiles.forEach((f) => {
        onProgress({ event, percent, file: f });
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
