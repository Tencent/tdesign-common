export interface ImageInfo {
  mainImage: string | File;
  thumbnail?: string | File;
  download?: boolean;
  isSvg?: boolean;
}

export type Images = Array<string | File | ImageInfo>;
