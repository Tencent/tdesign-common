import { isArray, isString } from 'lodash-es';
import type { ImageInfo, Images } from './types';

const isSameOrigin = (url: string) => {
  try {
    const imgUrl = new URL(url, window.location.href);
    return imgUrl.origin === window.location.origin;
  } catch {
    return false;
  }
};

const directDownload = (imgSrc: string, name: string) => {
  const a = document.createElement('a');
  a.download = name;
  a.href = imgSrc;
  a.click();
  a.remove();
};

const fileDownload = (obj: Blob | MediaSource, name: string) => {
  const url = URL.createObjectURL(obj);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const canvasDownload = (imgSrc: string, name: string) => {
  const image = new Image();
  image.setAttribute('crossOrigin', 'anonymous');

  image.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;

    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, image.width, image.height);

    const extension = name.split('.').pop()?.toLowerCase() || 'png';
    const mimeType = `image/${extension === 'jpg' ? 'jpeg' : extension}`;

    canvas.toBlob((blob) => {
      fileDownload(blob, name);
    }, mimeType);
  };
  image.src = imgSrc;
};

export const downloadImage = (imgSrc: string | File) => {
  const randomName = Math.random().toString(32).slice(2);

  if (imgSrc instanceof File) {
    fileDownload(imgSrc, imgSrc.name);
    return;
  }

  // fix: https://github.com/Tencent/tdesign-vue-next/issues/2936
  // 当链接携带了参数时，需处理掉参数再取图片名称，否则扩展名会与参数链接导致原扩展名失效
  // 例如：img.png?sign=xxx 不处理参数会被转成 img.png_sign=xxx
  const name = imgSrc?.split?.('?')?.[0]?.split?.('#')?.[0]?.split?.('/').pop() || randomName;

  if (isSameOrigin(imgSrc)) {
    directDownload(imgSrc, name);
  } else {
    canvasDownload(imgSrc, name);
  }
};

const isImageInfo = (image: string | File | ImageInfo): image is ImageInfo =>
  !!image && !isString(image) && !(image instanceof File);

export const formatImages = (images: Images): ImageInfo[] => {
  if (!isArray(images)) return [];
  return images.map((item) => {
    if (isImageInfo(item)) {
      return {
        download: true,
        thumbnail: item.mainImage,
        ...item,
      };
    }
    return {
      mainImage: item,
      thumbnail: item,
      download: true,
    };
  });
};
