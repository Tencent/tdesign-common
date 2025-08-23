import { WatermarkText, WatermarkImage } from './type';

export default function generateWatermark({
  width,
  height,
  gapX,
  gapY,
  offsetLeft,
  offsetTop,
  rotate,
  alpha,
  watermarkContent,
  lineSpace,
  fontColor = 'rgba(0,0,0,0.1)'
}: {
  width: number,
  height: number,
  gapX: number,
  gapY: number,
  offsetLeft: number,
  offsetTop: number,
  rotate: number,
  alpha: number,
  watermarkContent: WatermarkText | WatermarkImage | Array<WatermarkText | WatermarkImage>,
  lineSpace: number,
  fontColor?: string
}, onFinish: (url: string) => void): void {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.warn('当前环境不支持Canvas, 无法绘制水印');
    onFinish('');
    return;
  }

  const ratio = window.devicePixelRatio || 1;
  const canvasWidth = (gapX + width) * ratio;
  const canvasHeight = (gapY + height) * ratio;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  canvas.style.width = `${gapX + width}px`;
  canvas.style.height = `${gapY + height}px`;

  ctx.globalAlpha = alpha;
  ctx.fillStyle = 'transparent';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  const contents = Array.isArray(watermarkContent) ? watermarkContent : [watermarkContent];

  // 绘制两个水印：左上角和右下角
  const positions = [
    { x: offsetLeft, y: offsetTop }, // 左上角
    { x: offsetLeft + gapX, y: offsetTop + gapY } // 右下角
  ];

  let completedCount = 0;
  const totalPositions = positions.length;

  positions.forEach((position, posIndex) => {
    ctx.save();
    ctx.translate(position.x * ratio, position.y * ratio);
    ctx.rotate((Math.PI / 180) * Number(rotate));

    let top = 0;
    let pendingImages = 0;

    contents.forEach((item: WatermarkText & WatermarkImage) => {
      if (item.url) {
        const { url, isGrayscale = false } = item;
        const currentTop = top;
        top += height;
        pendingImages++;

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.referrerPolicy = 'no-referrer';
        img.src = url;
        img.onload = () => {
          ctx.drawImage(img, 0, currentTop * ratio, width * ratio, height * ratio);
          if (isGrayscale) {
            const imgData = ctx.getImageData(0, currentTop * ratio, width * ratio, height * ratio);
            const pixels = imgData.data;
            for (let i = 0; i < pixels.length; i += 4) {
              const lightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
              pixels[i] = lightness;
              pixels[i + 1] = lightness;
              pixels[i + 2] = lightness;
            }
            ctx.putImageData(imgData, 0, currentTop * ratio);
          }

          pendingImages--;
          if (pendingImages === 0) {
            completedCount++;
            if (completedCount === totalPositions) {
              onFinish(canvas.toDataURL());
            }
          }
        };
        img.onerror = () => {
          pendingImages--;
          if (pendingImages === 0) {
            completedCount++;
            if (completedCount === totalPositions) {
              onFinish(canvas.toDataURL());
            }
          }
        };
      } else if (item.text) {
        const {
          text,
          fontSize = 16,
          fontFamily = undefined,
          fontWeight = 'normal',
        } = item;
        const fillStyle = item?.fontColor || fontColor;
        const currentTop = top;
        top += lineSpace;

        const markSize = Number(fontSize) * ratio;
        const markHeight = height * ratio;
        ctx.font = `normal normal ${fontWeight} ${markSize}px/${markHeight}px ${fontFamily}`;
        ctx.textAlign = 'start';
        ctx.textBaseline = 'top';
        ctx.fillStyle = fillStyle;
        ctx.fillText(text, 0, currentTop * ratio);
      }
    });

    ctx.restore();

    // 如果没有图片需要加载，直接完成
    if (pendingImages === 0) {
      completedCount++;
      if (completedCount === totalPositions) {
        onFinish(canvas.toDataURL());
      }
    }
  });
}