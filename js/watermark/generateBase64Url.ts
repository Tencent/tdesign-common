import { WatermarkText, WatermarkImage } from './type';

export default function generateBase64Url({
  width,
  height,
  gapX,
  gapY,
  offset,
  rotate,
  alpha,
  watermarkContent,
  lineSpace
}: {
  width: number,
  height: number,
  gapX:number,
  gapY: number,
  offset:number,
  rotate:number,
  alpha:number,
  watermarkContent: WatermarkText | WatermarkImage | Array<WatermarkText | WatermarkImage>,
  lineSpace:number
}): string {
  let base64Url = '';
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    // eslint-disable-next-line no-console
    console.warn('当前环境不支持Canvas, 无法绘制水印');
    return base64Url;
  }
  const ratio = window.devicePixelRatio || 1;
  const canvasWidth = (gapX + width) * ratio;
  const canvasHeight = (gapY + height) * ratio;
  const canvasOffsetLeft = offset[0] || gapX / 2;
  const canvasOffsetTop = offset[1] || gapY / 2;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  canvas.style.width = `${gapX + width}px`;
  canvas.style.height = `${gapY + height}px`;

  ctx.translate(canvasOffsetLeft * ratio, canvasOffsetTop * ratio);
  ctx.rotate((Math.PI / 180) * Number(rotate));
  ctx.globalAlpha = alpha;

  const markWidth = width * ratio;
  const markHeight = height * ratio;

  ctx.fillStyle = 'transparent';
  ctx.fillRect(0, 0, markWidth, markHeight);

  const contents = Array.isArray(watermarkContent) ? watermarkContent : [{ ...watermarkContent }];
  let top = 0;
  contents.forEach((item: WatermarkText & WatermarkImage & { top: number }) => {
    if (item.url) {
      const { url, isGrayscale = false } = item;
      // eslint-disable-next-line no-param-reassign
      item.top = top;
      top += height;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.referrerPolicy = 'no-referrer';
      img.src = url;
      img.onload = () => {
        // ctx.filter = 'grayscale(1)';
        ctx.drawImage(img, 0, item.top * ratio, width * ratio, height * ratio);
        if (isGrayscale) {
          const imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
          const pixels = imgData.data;
          for (let i = 0; i < pixels.length; i += 4) {
            const lightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
            pixels[i] = lightness;
            pixels[i + 1] = lightness;
            pixels[i + 2] = lightness;
          }
          ctx.putImageData(imgData, 0, 0);
        }
        base64Url = canvas.toDataURL();
      };
    } else if (item.text) {
      const {
        text,
        fontColor = 'rgba(0, 0, 0, 0.1)',
        fontSize = 16,
        fontWeight = 'normal',
      } = item;
      // eslint-disable-next-line no-param-reassign
      item.top = top;
      top += lineSpace;
      const markSize = Number(fontSize) * ratio;
      ctx.font = `normal normal ${fontWeight} ${markSize}px/${markHeight}px`;
      ctx.textAlign = 'start';
      ctx.textBaseline = 'top';
      ctx.fillStyle = fontColor;
      ctx.fillText(text, 0, item.top * ratio);
    }
  });
  base64Url = canvas.toDataURL();
  return base64Url;
}
