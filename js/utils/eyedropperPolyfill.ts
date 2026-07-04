/**
 * eyedropper 不支持edge 和 谷歌之外的浏览器，这里使用ployfill填充
 * 代码参考 https://github.com/iam-medvedev/eyedropper-polyfill
 * 这个仓库比较少人使用，所以没有使用npm包，决定自己实现
 */
import html2canvas from 'html2canvas-pro';
import type { EyeDropper, ColorSelectionOptions, ColorSelectionResult } from './types';

type Point = {
  x: number;
  y: number;
};

/** Global `isOpen` state */
const isOpenState = {
  value: false,
};

const prefix = `[EyeDropper]`;

/**
 * Errors text
 */
export const errors = {
  canvasError: `${prefix} Error getting canvas`,
  color: `${prefix} Cannot get color`,
};

/**
 * Returns px value
 */
export function px<T extends number>(value: T): `${T}px` {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new Error();
  }
  return `${value}px`;
}

/**
 * 浏览器是否支持eyedropper
 * @returns boolean
 */
export function isEyeDropperSupported(): boolean {
  return 'EyeDropper' in window;
}

/**
 * 将polyfill注入
 */
export function attachPolyfill() {
  if (!Reflect.defineProperty(window, 'EyeDropper', { value: EyeDropperPolyfill })) {
    throw Error("Error attaching `EyeDropper` polyfill: couldn't attach `EyeDropper` to `window`");
  }
}

/**
 * EyeDropper API polyfill
 * https://wicg.github.io/eyedropper-api/#dom-colorselectionoptions
 */
export class EyeDropperPolyfill implements EyeDropper {
  private colorSelectionResult?: ColorSelectionResult;

  private previousDocumentCursor?: CSSStyleDeclaration['cursor'];

  private canvas?: HTMLCanvasElement;

  private canvasCtx?: CanvasRenderingContext2D | null;

  private resolve?: (result: ColorSelectionResult) => void;

  private lastPoint?: Point;

  private magnification = {
    size: 4,
    scale: 12,
  };

  constructor() {
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  /**
   * Opens the polyfilled eyedropper
   *
   * §3.3 EyeDropper interface ► `open()`
   */
  public async open(options: ColorSelectionOptions = {}): Promise<ColorSelectionResult> {
    // §3.3 EyeDropper interface ► `open()` ► p.2
    // Prevent opening if already open
    if (isOpenState.value) {
      return Promise.reject(new DOMException('Invalid state', 'InvalidStateError'));
    }

    // §3.3 EyeDropper interface ► `open()` ► p.3
    // Create a promise to handle the color selection
    const result = new Promise<ColorSelectionResult>((resolve, reject) => {
      // §3.3 EyeDropper interface ► `open()` ► p.4
      // Handle possible signal abortion
      if (options.signal) {
        if (options.signal.aborted) {
          this.stop();

          reject(options.signal.reason || new DOMException('Aborted', 'AbortError'));
          return; // eslint-disable-line no-promise-executor-return
        }

        const abortListener = () => {
          this.stop();
          if (options.signal) {
            reject(options.signal.reason || new DOMException('Aborted', 'AbortError'));
          }
        };

        options.signal.addEventListener('abort', abortListener);
      }

      // §3.3 EyeDropper interface ► `open()` ► p.5
      // Store the resolve function and start the eyedropper
      this.resolve = resolve;
      this.start();
    });

    return result;
  }

  /**
   * Starting eyedropper mode
   */
  private async start() {
    document.body.style.overflow = 'hidden';
    this.setWaitingCursor();
    await this.createScreenshot();
    this.revertWaitingCursor();
    this.bindEvents();
  }

  /**
   * Stopping eyedropper mode
   */
  private stop() {
    document.body.style.overflow = '';
    this.unbindEvents();
    this.removeScreenshot();
    this.colorSelectionResult = undefined;
    this.lastPoint = undefined;
    isOpenState.value = false;
  }

  /**
   * Creates fake screenshot of page and assign it to the body
   */
  private async createScreenshot() {
    this.canvas = await html2canvas(document.body, {
      allowTaint: true,
      useCORS: true,
      height: document.body.scrollHeight,
      width: document.body.scrollWidth,
    });

    this.addCanvasStyle(this.canvas);
    this.canvasCtx = this.canvas.getContext('2d', {
      willReadFrequently: true,
    });
    document.body.appendChild(this.canvas);
  }

  /**
   * Removes screenshot from page
   */
  private removeScreenshot() {
    if (!this.canvas) {
      throw new Error(errors.canvasError);
    }

    document.body.removeChild(this.canvas);
    this.canvas = undefined;
    this.canvasCtx = undefined;
  }

  /**
   * Sets waiting cursor
   */
  private setWaitingCursor() {
    this.previousDocumentCursor = document.documentElement.style.cursor;
    document.documentElement.style.cursor = 'wait';
  }

  /**
   * Removes waiting cursor
   */
  private revertWaitingCursor() {
    if (this.previousDocumentCursor) {
      document.documentElement.style.cursor = this.previousDocumentCursor;
    } else {
      document.documentElement.style.cursor = '';
    }

    this.previousDocumentCursor = undefined;
  }

  /**
   * Binds events
   */
  private bindEvents() {
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('click', this.onClick);
  }

  /**
   * Unbinds `mousemove` events
   */
  private unbindEvents() {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('click', this.onClick);
  }

  /**
   * `click` handler
   */
  private onClick() {
    if (!this.lastPoint) {
      throw new Error(errors.color);
    }

    this.detectColor(this.lastPoint);
    const newValue = this.colorSelectionResult;
    this.stop();

    if (newValue && this.resolve) {
      this.resolve(newValue);
    }
  }

  /**
   * `mousemove` handler
   */
  private onMouseMove(event: MouseEvent) {
    if (!this.canvas || !this.canvasCtx) {
      throw new Error(errors.canvasError);
    }

    const dpr = window.devicePixelRatio;
    this.lastPoint = {
      x: (event.clientX + window.scrollX) * dpr,
      y: (event.clientY + window.scrollY) * dpr,
    };

    // Move magnifier
    // const position = `${this.lastPoint.x / dpr} ${this.lastPoint.y / dpr}px`;
    const position = [px(this.lastPoint.x / dpr), px(this.lastPoint.y / dpr)].join(' ');
    Object.assign(this.canvas.style, {
      opacity: 1,
      transformOrigin: position,
      clipPath: `circle(${px(this.magnification.size)} at ${position})`,
    });
  }

  /**
   * Detects color from canvas data
   */
  private detectColor(point: Point) {
    if (!this.canvasCtx) {
      throw new Error(errors.canvasError);
    }

    const pixelData = this.canvasCtx.getImageData(point.x, point.y, 1, 1).data;

    const red = pixelData[0];
    const green = pixelData[1];
    const blue = pixelData[2];

    // eslint-disable-next-line no-bitwise
    const hex = ((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1);

    this.colorSelectionResult = {
      sRGBHex: `#${hex}`,
    };
  }

  /**
   * Canvas styles creator
   */
  private addCanvasStyle(canvas: HTMLCanvasElement) {
    Object.assign(canvas.style, {
      position: 'fixed',
      top: '0px',
      marginTop: `${-window.scrollY}px`,
      left: '0px',
      zIndex: 999999,
      opacity: 0,
      transform: `scale(${this.magnification.scale})`,
      imageRendering: 'pixelated',
    });
  }
}
