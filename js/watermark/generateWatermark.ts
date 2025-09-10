// generateWatermark-v2 支持layout生成不同样式的水印

import { WatermarkText, WatermarkImage,WatermarkLayout } from "./type";

const ratio = window.devicePixelRatio || 1;

// 元素中心为旋转点执行旋转
const drawRotate = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  rotate: number,
) => {
  ctx.translate(x, y);
  ctx.rotate((Math.PI / 180) * Number(rotate));
  ctx.translate(-x, -y);
};

// 绘制文字
const drawText = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  markHeight: number,
  text: string,
  fontWeight: string,
  fontSize: number,
  fontFamily: string,
  fillStyle: string
) => {
  ctx.font = `normal normal ${fontWeight} ${
    fontSize * ratio
  }px/${markHeight}px ${fontFamily}`;
  ctx.fillStyle = fillStyle;
  ctx.textAlign = "start";
  ctx.textBaseline = "top";

  ctx.fillText(text, x, y);
};

export default function generateWatermark(
  {
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
    fontColor = "rgba(0,0,0,0.1)",
    layout,
  }: {
    width: number;
    height: number;
    gapX: number;
    gapY: number;
    offsetLeft: number;
    offsetTop: number;
    rotate: number;
    alpha: number;
    watermarkContent:
      | WatermarkText
      | WatermarkImage
      | Array<WatermarkText | WatermarkImage>;
    lineSpace: number;
    fontColor?: string;
    layout: WatermarkLayout;
  },
  onFinish: (url: string, backgroundSize?: { width: number }) => void
): string {
  const isHexagonal = layout === "hexagonal";

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.warn("当前环境不支持Canvas, 无法绘制水印");
    onFinish("");
    return;
  }

  const ratio = window.devicePixelRatio || 1;

  let actualBackgroundSize = {
    width: gapX + width,
  };

  const canvasWidth = (gapX + width) * ratio;
  const canvasHeight = (gapY + height) * ratio;

  const markWidth = width * ratio;
  const markHeight = height * ratio;

  const dislocationRotateX = canvasWidth;
  const dislocationRotateY = canvasHeight;
  const dislocationDrawX = (gapX + width) * ratio;
  const dislocationDrawY = (gapY + height) * ratio;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  canvas.style.width = `${gapX + width}px`;
  canvas.style.height = `${gapY + height}px`;

  if (isHexagonal) {
    canvas.style.width = `${canvasWidth * 2}px`;
    canvas.style.height = `${canvasHeight * 2}px`;
    canvas.width = canvasWidth * 2;
    canvas.height = canvasHeight * 2;

    // 两倍宽度+间距
    actualBackgroundSize = {
      width: gapX + (width * 2) + width / 2,
    };
  }

  ctx.translate(offsetLeft * ratio, offsetTop * ratio);
  ctx.globalAlpha = alpha;

  ctx.fillStyle = "transparent";
  ctx.fillRect(0, 0, markWidth, markHeight);

  ctx.save();
  drawRotate(ctx, 0, 0, rotate);

  const contents = Array.isArray(watermarkContent)
    ? watermarkContent
    : [{ ...watermarkContent }];

  let top = 0;

  contents.forEach((item: WatermarkText & WatermarkImage & { top: number }) => {
    if (item.url) {
      const { url, isGrayscale = false } = item;
      item.top = top;
      top += height;
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.referrerPolicy = "no-referrer";
      img.src = url;
      img.onload = () => {
        ctx.drawImage(img, 0, item.top * ratio, width * ratio, height * ratio);

        // 错位水印
        if (isHexagonal) {
          ctx.restore();
          drawRotate(ctx, dislocationRotateX, dislocationRotateY, rotate);
          ctx.drawImage(
            img,
            dislocationDrawX,
            dislocationDrawY,
            width * ratio,
            height * ratio
          );
        }

        if (isGrayscale) {
          const imgData = ctx.getImageData(
            0,
            0,
            ctx.canvas.width,
            ctx.canvas.height
          );
          const pixels = imgData.data;
          for (let i = 0; i < pixels.length; i += 4) {
            const lightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
            pixels[i] = lightness;
            pixels[i + 1] = lightness;
            pixels[i + 2] = lightness;
          }
          ctx.putImageData(imgData, 0, 0);
        }
        onFinish(canvas.toDataURL(), actualBackgroundSize);
      };
    } else if (item.text) {
      const {
        text,
        fontSize = 16,
        fontFamily = "normal",
        fontWeight = "normal",
      } = item;
      const fillStyle = item?.fontColor || fontColor;

      item.top = top;
      top += lineSpace;

      drawText(
        ctx,
        0,
        item.top * ratio + item.top * ((fontSize * ratio + 3) * ratio),
        markHeight,
        text,
        fontWeight,
        fontSize,
        fontFamily,
        fillStyle
      );

      // 错位水印
      if (isHexagonal) {
        ctx.restore();
        drawRotate(ctx, dislocationRotateX, dislocationRotateY, rotate);

        drawText(
          ctx,
          dislocationDrawX,
          dislocationDrawY,
          markHeight,
          text,
          fontWeight,
          fontSize,
          fontFamily,
          fillStyle
        );
      }
    }
  });

  onFinish(canvas.toDataURL(), actualBackgroundSize);
}