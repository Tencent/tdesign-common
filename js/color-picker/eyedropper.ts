/**
 * TDesign ColorPicker — EyeDropper (吸色) API Wrapper
 *
 * Uses the browser's native EyeDropper API to pick a color from anywhere
 * on the screen. The EyeDropper API is available in Chromium-based browsers
 * (Chrome 95+, Edge 95+, Opera 81+) and requires a user gesture.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper
 * @see https://wicg.github.io/eyedropper-api/
 *
 * Usage:
 *   import { openEyeDropper, isEyeDropperSupported } from './eyedropper';
 *
 *   if (isEyeDropperSupported()) {
 *     const color = await openEyeDropper();
 *     if (color) {
 *       // color is a hex string like "#FF0000"
 *     }
 *   }
 */

// ============================================
// Type Definitions
// ============================================

/**
 * Result from the EyeDropper API.
 * The sRGBHex is a 7-character hex string like "#FF0000".
 */
export interface EyeDropperResult {
  /** sRGB hex color string, e.g. "#FF0000" */
  sRGBHex: string;
}

/**
 * Possible error types from the EyeDropper API.
 */
export enum EyeDropperErrorType {
  /** User cancelled / dismissed the eye dropper without picking */
  ABORT = 'AbortError',
  /** The operation is not supported by the browser */
  NOT_SUPPORTED = 'NotSupportedError',
  /** The operation timed out */
  TIMEOUT = 'TimeoutError',
  /** Generic / unknown error */
  UNKNOWN = 'UnknownError',
}

/**
 * Structured error from EyeDropper operations.
 */
export interface EyeDropperError {
  type: EyeDropperErrorType;
  message: string;
  originalError?: Error;
}

// ============================================
// Feature Detection
// ============================================

/**
 * Check whether the browser supports the EyeDropper API.
 *
 * Returns `true` if `window.EyeDropper` is available.
 * The API requires a secure context (HTTPS or localhost)
 * and is NOT available in iframes without allow="eyedropper".
 *
 * @returns {boolean} Whether EyeDropper API is available
 */
export function isEyeDropperSupported(): boolean {
  return typeof window !== 'undefined' && 'EyeDropper' in window;
}

// ============================================
// Core EyeDropper Operation
// ============================================

/**
 * Open the native eye dropper tool and return the selected color.
 *
 * **Must be called from a user gesture** (click, touch, keydown).
 * If called from a non-gesture context, the browser will reject with
 * an AbortError or NotAllowedError.
 *
 * @param options - Optional configuration
 * @param options.signal - An AbortSignal to cancel the operation programmatically
 * @param options.timeout - Timeout in ms (default 30000). After this, the
 *   operation is cancelled. 0 = no timeout.
 *
 * @returns A Promise resolving to the hex color string (e.g. "#FF0000"),
 *   or `null` if the user cancelled or an error occurred.
 *
 * @example
 * ```ts
 * button.addEventListener('click', async () => {
 *   const color = await openEyeDropper();
 *   if (color) {
 *     console.log('Picked color:', color);
 *   }
 * });
 * ```
 */
export async function openEyeDropper(
  options: {
    signal?: AbortSignal;
    timeout?: number;
  } = {}
): Promise<string | null> {
  const { signal, timeout = 30000 } = options;

  // Feature detection
  if (!isEyeDropperSupported()) {
    console.warn(
      '[TDesign ColorPicker] EyeDropper API is not supported in this browser. ' +
      'Requires Chromium 95+ with a secure context (HTTPS/localhost).'
    );
    return null;
  }

  try {
    // Create AbortController with timeout if specified
    let abortController: AbortController | undefined;
    let mergedSignal: AbortSignal | undefined = signal;

    if (timeout > 0) {
      abortController = new AbortController();

      // Merge external signal with timeout signal
      if (signal) {
        // If external signal already aborted, don't proceed
        if (signal.aborted) {
          return null;
        }
        signal.addEventListener('abort', () => abortController!.abort(), { once: true });
      }

      const timeoutId = setTimeout(() => abortController!.abort(), timeout);
      // Clean up timeout if operation completes
      const cleanup = () => clearTimeout(timeoutId);
      abortController.signal.addEventListener('abort', cleanup, { once: true });

      mergedSignal = abortController.signal;
    }

    // @ts-expect-error - EyeDropper is not in TypeScript's DOM types yet
    const eyeDropper = new window.EyeDropper();

    const result: EyeDropperResult = await eyeDropper.open({
      signal: mergedSignal,
    });

    if (result && result.sRGBHex) {
      // Validate the returned hex color
      const hex = result.sRGBHex.trim();
      if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
        return hex;
      }
      console.warn(
        '[TDesign ColorPicker] EyeDropper returned an invalid hex color:',
        hex
      );
      return null;
    }

    return null;
  } catch (error: any) {
    // User cancelled — not an error, just return null
    if (
      error?.name === 'AbortError' ||
      error?.code === DOMException?.ABORT_ERR
    ) {
      if (signal?.aborted) {
        // External cancellation
        return null;
      }
      // User dismissed the eye dropper without picking
      return null;
    }

    // Not supported
    if (error?.name === 'NotSupportedError') {
      console.warn(
        '[TDesign ColorPicker] EyeDropper API is not supported:',
        error.message
      );
      return null;
    }

    // Other errors
    console.error('[TDesign ColorPicker] EyeDropper error:', error);
    return null;
  }
}

/**
 * Open eye dropper and parse the result into a structured error/result.
 * Useful when you need to differentiate between "user cancelled" and
 * "browser not supported" (e.g., to show different UI messages).
 *
 * @returns { sRGBHex: string } on success, { error: EyeDropperError } on failure
 */
export async function openEyeDropperWithResult(): Promise<
  | { sRGBHex: string; error?: undefined }
  | { sRGBHex?: undefined; error: EyeDropperError }
> {
  if (!isEyeDropperSupported()) {
    return {
      error: {
        type: EyeDropperErrorType.NOT_SUPPORTED,
        message:
          'EyeDropper API is not supported. Requires Chromium 95+ with HTTPS/localhost.',
      },
    };
  }

  try {
    // @ts-expect-error - EyeDropper is not in TypeScript's DOM types yet
    const eyeDropper = new window.EyeDropper();
    const result: EyeDropperResult = await eyeDropper.open();
    const hex = result.sRGBHex.trim();

    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      return { sRGBHex: hex };
    }

    return {
      error: {
        type: EyeDropperErrorType.UNKNOWN,
        message: `Invalid color returned: ${hex}`,
      },
    };
  } catch (error: any) {
    const errorName = error?.name || '';

    if (
      errorName === 'AbortError' ||
      error?.code === DOMException?.ABORT_ERR
    ) {
      return {
        error: {
          type: EyeDropperErrorType.ABORT,
          message: 'EyeDropper was cancelled or aborted.',
          originalError: error,
        },
      };
    }

    if (errorName === 'NotSupportedError') {
      return {
        error: {
          type: EyeDropperErrorType.NOT_SUPPORTED,
          message: error.message || 'EyeDropper API not supported.',
          originalError: error,
        },
      };
    }

    return {
      error: {
        type: EyeDropperErrorType.UNKNOWN,
        message: error.message || 'Unknown EyeDropper error.',
        originalError: error,
      },
    };
  }
}

// ============================================
// Integration helpers for TDesign ColorPicker
// ============================================

/**
 * Open the eye dropper and convert the result to the same format
 * used by the TDesign ColorPicker's Color class.
 *
 * This is the recommended integration method for framework components
 * (Vue, React, etc.).
 *
 * @example
 * ```ts
 * // In a Vue component
 * async onEyeDropperClick() {
 *   const color = await eyedropperToColor();
 *   if (color) {
 *     this.colorPicker.update(color);  // feed back into ColorPicker
 *   }
 * }
 * ```
 */
export async function eyedropperToColor(): Promise<string | null> {
  return openEyeDropper();
}

/**
 * Type declaration for the EyeDropper API.
 * This extends the global Window interface so TypeScript
 * doesn't complain about `window.EyeDropper`.
 */
declare global {
  interface Window {
    EyeDropper?: {
      new (): EyeDropperInstance;
    };
  }

  interface EyeDropperInstance {
    open(options?: { signal?: AbortSignal }): Promise<EyeDropperResult>;
  }
}

export default openEyeDropper;
