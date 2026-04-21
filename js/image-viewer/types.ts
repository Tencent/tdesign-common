export interface ImageInfo {
  mainImage: string | File;
  thumbnail?: string | File;
  download?: boolean;
  isSvg?: boolean;
}

export type Images = Array<string | File | ImageInfo>;

/** 位移偏移量 */
export interface TranslateOffset {
  translateX: number;
  translateY: number;
}

/** 缩放选项 */
export interface ZoomOptions {
  /** 缩放中心点 X 坐标（相对于预览图片容器中心的偏移量） */
  mouseOffsetX?: number;
  /** 缩放中心点 Y 坐标（相对于预览图片容器中心的偏移量） */
  mouseOffsetY?: number;
  /** 当前位移 */
  currentTranslate?: TranslateOffset;
}

/** 缩放结果 */
export interface ZoomResult {
  /** 缩放后的新位移 */
  newTranslate?: TranslateOffset;
}

/** 图片缩放配置 */
export interface ImageScale {
  /** 缩放的最大比例 */
  max: number;
  /** 缩放的最小比例 */
  min: number;
  /** 缩放的步长速度 */
  step: number;
  /** 默认的缩放比例 */
  defaultScale: number;
}
