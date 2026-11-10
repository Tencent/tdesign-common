type Html2Canvas = (
  element: HTMLElement,
  options?: {
    allowTaint?: boolean;
    backgroundColor?: string | null;
    height?: number;
    scale?: number;
    scrollX?: number;
    scrollY?: number;
    useCORS?: boolean;
    width?: number;
    x?: number;
    y?: number;
  }
) => Promise<HTMLCanvasElement>;

export interface EyeDropperResult {
  sRGBHex: string;
}

export interface NativeEyeDropperOpenOptions {
  signal?: AbortSignal;
}

export type EyeDropperMode = 'native' | 'fallback';

export interface OpenEyeDropperOptions {
  mode?: EyeDropperMode;
  showPreview?: boolean;
  signal?: AbortSignal;
  root?: HTMLElement;
  html2canvas?: Html2Canvas;
}

export type EyeDropperConfig = boolean | OpenEyeDropperOptions;

interface EyeDropperInstance {
  open(options?: NativeEyeDropperOpenOptions): Promise<EyeDropperResult>;
}

interface EyeDropperConstructor {
  new (): EyeDropperInstance;
}

const MASK_CLASS_NAME = 't-color-picker__eyedropper-mask';
const CANVAS_CLASS_NAME = 't-color-picker__eyedropper-canvas';
const PREVIEW_CLASS_NAME = 't-color-picker__eyedropper-preview';
const MAX_FALLBACK_SCALE = 2;

function getEyeDropperCtor(): EyeDropperConstructor | undefined {
  if (typeof window === 'undefined') return undefined;
  const { EyeDropper } = window as Window & { EyeDropper?: unknown };
  return typeof EyeDropper === 'function' ? (EyeDropper as EyeDropperConstructor) : undefined;
}

function canUseFallback(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined' && Boolean(document.body);
}

function normalizeOptions(options?: OpenEyeDropperOptions | AbortSignal): OpenEyeDropperOptions {
  if (!options) return {};
  if (typeof AbortSignal !== 'undefined' && options instanceof AbortSignal) {
    return { signal: options };
  }
  return options as OpenEyeDropperOptions;
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((value) => value.toString(16).padStart(2, '0')).join('')}`;
}

async function getHtml2Canvas(options: OpenEyeDropperOptions): Promise<Html2Canvas | null> {
  if (options.html2canvas) return options.html2canvas;

  try {
    const module = await import('html2canvas-pro');
    return module.default as Html2Canvas;
  } catch {
    return null;
  }
}

function appendFallbackLayer(canvas: HTMLCanvasElement, showPreview: boolean) {
  const mask = document.createElement('div');
  const preview = document.createElement('div');

  mask.className = MASK_CLASS_NAME;
  canvas.classList.add(CANVAS_CLASS_NAME);
  preview.className = PREVIEW_CLASS_NAME;

  mask.appendChild(canvas);
  if (showPreview) mask.appendChild(preview);
  document.body.appendChild(mask);

  return { mask, preview };
}

function pickCanvasColor(canvas: HTMLCanvasElement, x: number, y: number, scale: number): string | null {
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) return null;

  try {
    const pixelX = Math.min(Math.max(Math.round(x * scale), 0), canvas.width - 1);
    const pixelY = Math.min(Math.max(Math.round(y * scale), 0), canvas.height - 1);
    const [r, g, b] = context.getImageData(pixelX, pixelY, 1, 1).data;

    return rgbToHex(r, g, b);
  } catch {
    return null;
  }
}

export function isNativeEyeDropperSupported(): boolean {
  return getEyeDropperCtor() !== undefined;
}

export function isEyeDropperSupported(options?: Pick<OpenEyeDropperOptions, 'mode'>): boolean {
  if (isNativeEyeDropperSupported()) return true;
  return options?.mode === 'fallback' && canUseFallback();
}

export async function openNativeEyeDropper(signal?: AbortSignal): Promise<string | null> {
  const EyeDropperCtor = getEyeDropperCtor();
  if (!EyeDropperCtor) return null;

  try {
    const result = await new EyeDropperCtor().open(signal ? { signal } : undefined);
    return result.sRGBHex.toLowerCase();
  } catch {
    return null;
  }
}

export async function openFallbackEyeDropper(options: OpenEyeDropperOptions = {}): Promise<string | null> {
  if (!canUseFallback()) return null;

  try {
    const html2canvas = await getHtml2Canvas(options);
    if (!html2canvas) return null;

    const root = options.root || document.body;
    const scale = Math.min(window.devicePixelRatio || 1, MAX_FALLBACK_SCALE);
    const canvas = await html2canvas(root, {
      allowTaint: false,
      backgroundColor: null,
      height: window.innerHeight,
      scale,
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      useCORS: true,
      width: window.innerWidth,
      x: window.scrollX,
      y: window.scrollY,
    });
    const { mask, preview } = appendFallbackLayer(canvas, options.showPreview !== false);

    return await new Promise((resolve) => {
      let rafId = 0;
      let lastMouseEvent: MouseEvent | null = null;

      const cleanup = () => {
        if (rafId) {
          window.cancelAnimationFrame(rafId);
          rafId = 0;
        }
        options.signal?.removeEventListener('abort', handleAbort);
        window.removeEventListener('keydown', handleKeyDown);
        mask.removeEventListener('mousemove', handleMouseMove);
        mask.removeEventListener('click', handleClick);
        mask.remove();
      };

      const finish = (value: string | null) => {
        cleanup();
        resolve(value);
      };

      const handleAbort = () => finish(null);

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          finish(null);
        }
      };

      const updatePreview = () => {
        rafId = 0;
        if (!lastMouseEvent) return;
        const { clientX, clientY } = lastMouseEvent;
        const color = pickCanvasColor(canvas, clientX, clientY, scale);
        if (!color || !preview.parentElement) return;

        preview.style.backgroundColor = color;
        preview.style.left = `${clientX}px`;
        preview.style.top = `${clientY}px`;
      };

      const handleMouseMove = (event: MouseEvent) => {
        lastMouseEvent = event;
        if (!rafId) {
          rafId = window.requestAnimationFrame(updatePreview);
        }
      };

      const handleClick = (event: MouseEvent) => {
        event.preventDefault();
        finish(pickCanvasColor(canvas, event.clientX, event.clientY, scale));
      };

      if (options.signal?.aborted) {
        finish(null);
        return;
      }

      options.signal?.addEventListener('abort', handleAbort, { once: true });
      window.addEventListener('keydown', handleKeyDown);
      mask.addEventListener('mousemove', handleMouseMove);
      mask.addEventListener('click', handleClick);
    });
  } catch {
    return null;
  }
}

export async function openEyeDropper(options?: OpenEyeDropperOptions | AbortSignal): Promise<string | null> {
  const normalizedOptions = normalizeOptions(options);

  if (isNativeEyeDropperSupported()) {
    return openNativeEyeDropper(normalizedOptions.signal);
  }

  return normalizedOptions.mode === 'fallback' ? openFallbackEyeDropper(normalizedOptions) : null;
}
