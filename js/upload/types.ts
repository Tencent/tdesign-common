export type UploadProgressType = 'real' | 'mock';

export type SizeUnit = 'B' | 'KB' | 'MB' | 'GB'
export interface UploadFile {
  /**
   * 上一次变更的时间
   */
  lastModified?: number;
  /**
   * 文件名称
   * @default ''
   */
  name?: string;
  /**
   * 下载进度
   */
  percent?: number;
  /**
   * 原始文件对象
   */
  raw?: File;
  /**
   * 上传接口返回的数据
   */
  response?: object;
  /**
   * 文件大小
   */
  size?: number;
  /**
   * 文件上传状态：上传成功，上传失败，上传中，等待上传
   * @default ''
   */
  status?: 'success' | 'fail' | 'progress' | 'waiting';
  /**
   * 文件类型
   * @default ''
   */
  type?: string;
  /**
   * 文件上传成功后的下载/访问地址
   * @default ''
   */
  url?: string;
}

export interface RequestMethodResponse {
  status: 'success' | 'fail';
  error?: string;
  response: { url?: string; [key: string]: any }
}

export interface ProgressContext {
  e?: ProgressEvent;
  file?: UploadFile;
  percent: number;
  type: UploadProgressType
}

export interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

export interface InnerProgressContext {
  event?: ProgressEvent;
  file?: UploadFile;
  files?: UploadFile[];
  percent: number;
  type?: ProgressContext['type'];
}

export interface SuccessContext {
  event?: ProgressEvent;
  file?: UploadFile;
  files?: UploadFile[];
  response: RequestMethodResponse['response'];
}

export interface UploadRemoveOptions {
  e: MouseEvent;
  file?: UploadFile;
  files?: UploadFile[];
  index: number
}

export interface FlowRemoveContext {
  e: MouseEvent;
  index: number;
  file?: UploadFile;
}

export interface XhrOptions {
  method?: string;
  action: string;
  withCredentials: boolean;
  headers: { [key: string]: string };
  data: { [key: string]: any } | Function;
  file?: UploadFile;
  files?: UploadFile[];
  name: string;
  onError: ({
    event, file, files, response
  }: {
    event?: ProgressEvent; file?: UploadFile; files?: UploadFile[]; response?: any
  }) => void;
  onSuccess: (context: SuccessContext) => void;
  onProgress: (context: InnerProgressContext) => void;
}

export interface TdUploadFile extends UploadFile {
  uid?: string;
  xhr?: XMLHttpRequest;
}
