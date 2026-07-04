/**
 * eyedropper polyfill — 基于 html2canvas 截图方案
 * 代码参考 https://github.com/iam-medvedev/eyedropper-polyfill
 *
 * 已知限制：html2canvas 无法渲染部分现代 CSS（背景图/渐变），
 * 这些区域在截图中显示白色，是技术固有限制。
 */
import html2canvas from 'html2canvas-pro';
import type { EyeDropper, ColorSelectionOptions, ColorSelectionResult } from './types';

type Point = { x: number; y: number };

const isOpenState = { value: false };
const prefix = '[EyeDropper]';

export const errors = {
  canvasError: `${prefix} Error getting canvas`,
  color: `${prefix} Cannot get color`,
};

export function px(value: number): string {
  return `${value}px`;
}

export function isEyeDropperSupported(): boolean {
  return 'EyeDropper' in window;
}

export function attachPolyfill() {
  if (!Reflect.defineProperty(window, 'EyeDropper', { value: EyeDropperPolyfill })) {
    throw Error("Error attaching `EyeDropper` polyfill: couldn't attach `EyeDropper` to `window`");
  }
}

export class EyeDropperPolyfill implements EyeDropper {
  private colorSelectionResult?: ColorSelectionResult;

  private previousDocumentCursor?: string;

  private canvas?: HTMLCanvasElement;

  private canvasCtx?: CanvasRenderingContext2D | null;

  private resolve?: (result: ColorSelectionResult) => void;

  private lastPoint?: Point;

  private magnification = { size: 4, scale: 12 };

  constructor() {
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  public async open(options: ColorSelectionOptions = {}): Promise<ColorSelectionResult> {
    if (isOpenState.value) {
      return Promise.reject(new DOMException('Invalid state', 'InvalidStateError'));
    }
    return new Promise<ColorSelectionResult>((resolve, reject) => {
      if (options.signal) {
        if (options.signal.aborted) {
          this.stop();
          reject(options.signal.reason || new DOMException('Aborted', 'AbortError'));
          return;
        }
        options.signal.addEventListener('abort', () => {
          this.stop();
          reject(options.signal.reason || new DOMException('Aborted', 'AbortError'));
        });
      }
      this.resolve = resolve;
      this.start();
    });
  }

  private async start() {
    isOpenState.value = true;
    document.body.style.overflow = 'hidden';
    this.setWaitingCursor();
    await this.createScreenshot();
    this.revertWaitingCursor();
    this.bindEvents();
  }

  private stop() {
    isOpenState.value = false;
    document.body.style.overflow = '';
    this.unbindEvents();
    this.removeScreenshot();
    this.colorSelectionResult = undefined;
    this.lastPoint = undefined;
  }

  private async createScreenshot() {
    // 截取整个页面（包括滚动区域）
    this.canvas = await html2canvas(document.body, {
      allowTaint: true,
      useCORS: true,
      width: document.body.clientWidth,
      height: document.body.clientHeight,
    });
    this.canvasCtx = this.canvas.getContext('2d', { willReadFrequently: true });
    this.addCanvasStyle(this.canvas);
    document.body.appendChild(this.canvas);
  }

  private removeScreenshot() {
    if (this.canvas) {
      document.body.removeChild(this.canvas);
      this.canvas = undefined;
      this.canvasCtx = undefined;
    }
  }

  private setWaitingCursor() {
    this.previousDocumentCursor = document.documentElement.style.cursor;
    document.documentElement.style.cursor = 'wait';
  }

  private revertWaitingCursor() {
    document.documentElement.style.cursor = this.previousDocumentCursor || '';
    this.previousDocumentCursor = undefined;
  }

  private bindEvents() {
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('click', this.onClick);
    window.addEventListener('keydown', this.onKeyDown);
  }

  private unbindEvents() {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('click', this.onClick);
    window.removeEventListener('keydown', this.onKeyDown);
  }

  private onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      this.stop();
    }
  }

  private onClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.lastPoint) throw new Error(errors.color);
    this.detectColor(this.lastPoint);
    const result = this.colorSelectionResult;
    this.stop();
    if (result && this.resolve) this.resolve(result);
  }

  private onMouseMove(event: MouseEvent) {
    if (!this.canvas) return;
    const dpr = window.devicePixelRatio;
    // Canvas 截取了整个页面（包括滚动区域），所以坐标需要加上页面滚动偏移
    this.lastPoint = {
      x: (event.clientX + window.scrollX) * dpr,
      y: (event.clientY + window.scrollY) * dpr,
    };
    const pos = `${this.lastPoint.x / dpr}px ${this.lastPoint.y / dpr}px`;
    Object.assign(this.canvas.style, {
      opacity: '1',
      transformOrigin: pos,
      clipPath: `circle(${px(this.magnification.size)} at ${pos})`,
    });
  }

  private detectColor(point: Point) {
    if (!this.canvasCtx) throw new Error(errors.canvasError);
    const [r, g, b] = this.canvasCtx.getImageData(point.x, point.y, 1, 1).data;
    // eslint-disable-next-line no-bitwise
    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    this.colorSelectionResult = { sRGBHex: hex };
  }

  /**
   * Canvas styles creator
   */
  private addCanvasStyle(canvas: HTMLCanvasElement) {
    // eslint-disable-next-line class-methods-use-this
    Object.assign(canvas.style, {
      position: 'fixed',
      top: '0px',
      marginTop: `${-window.scrollY}px`,
      left: '0px',
      zIndex: '999999',
      opacity: '0',
      transform: `scale(${this.magnification.scale})`,
      imageRendering: 'pixelated',
    });
  }
}
