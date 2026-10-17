// @vitest-environment jsdom
/* eslint-disable max-classes-per-file */
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  isEyeDropperSupported,
  isNativeEyeDropperSupported,
  openEyeDropper,
  openFallbackEyeDropper,
} from '../../../js/color-picker/eyedropper';

afterEach(() => {
  vi.unstubAllGlobals();
  document.body.innerHTML = '';
});

class MockEyeDropper {
  // eslint-disable-next-line class-methods-use-this
  open(_options?: { signal?: AbortSignal }) {
    return Promise.resolve({ sRGBHex: '#AaBbCc' });
  }
}

class AbortingEyeDropper {
  // eslint-disable-next-line class-methods-use-this
  open() {
    return Promise.reject(new DOMException('User aborted', 'AbortError'));
  }
}

describe('EyeDropper support detection', () => {
  it('detects missing native EyeDropper API', () => {
    expect(isNativeEyeDropperSupported()).toBe(false);
    expect(isEyeDropperSupported()).toBe(false);
  });

  it('detects native EyeDropper API', () => {
    vi.stubGlobal('EyeDropper', MockEyeDropper);

    expect(isNativeEyeDropperSupported()).toBe(true);
    expect(isEyeDropperSupported()).toBe(true);
  });

  it('treats fallback mode as supported in browser-like environment', () => {
    expect(isEyeDropperSupported({ mode: 'fallback' })).toBe(true);
  });
});

describe('openEyeDropper', () => {
  it('returns the selected native color in lowercase', async () => {
    vi.stubGlobal('EyeDropper', MockEyeDropper);

    expect(await openEyeDropper()).toBe('#aabbcc');
  });

  it('forwards AbortSignal to native EyeDropper.open()', async () => {
    const open = vi.fn().mockResolvedValue({ sRGBHex: '#112233' });
    vi.stubGlobal(
      'EyeDropper',
      class {
        open = open;
      }
    );

    const controller = new AbortController();
    await openEyeDropper(controller.signal);

    expect(open).toHaveBeenCalledWith({ signal: controller.signal });
  });

  it('returns null when the user cancels native picking', async () => {
    vi.stubGlobal('EyeDropper', AbortingEyeDropper);

    expect(await openEyeDropper()).toBeNull();
  });

  it('does not fall back when native picking is canceled', async () => {
    const html2canvas = vi.fn();
    vi.stubGlobal('EyeDropper', AbortingEyeDropper);

    expect(await openEyeDropper({ mode: 'fallback', html2canvas })).toBeNull();
    expect(html2canvas).not.toHaveBeenCalled();
  });
});

describe('openFallbackEyeDropper', () => {
  function createCanvas(color: [number, number, number]) {
    const canvas = document.createElement('canvas');
    canvas.width = 10;
    canvas.height = 10;
    canvas.getContext = vi.fn().mockReturnValue({
      getImageData: vi.fn().mockReturnValue({
        data: new Uint8ClampedArray([...color, 255]),
      }),
    });
    return canvas;
  }

  it('picks a color from the fallback canvas', async () => {
    const html2canvas = vi.fn().mockResolvedValue(createCanvas([17, 34, 51]));

    const promise = openFallbackEyeDropper({ html2canvas });
    await vi.waitFor(() => {
      expect(document.querySelector('.t-color-picker__eyedropper-mask')).toBeTruthy();
    });
    document.querySelector('.t-color-picker__eyedropper-mask')?.dispatchEvent(
      new MouseEvent('click', {
        clientX: 1,
        clientY: 1,
        bubbles: true,
      })
    );

    expect(await promise).toBe('#112233');
    expect(document.querySelector('.t-color-picker__eyedropper-mask')).toBeNull();
  });

  it('returns null when fallback picking is aborted', async () => {
    const html2canvas = vi.fn().mockResolvedValue(createCanvas([17, 34, 51]));
    const controller = new AbortController();

    const promise = openFallbackEyeDropper({ html2canvas, signal: controller.signal });
    await vi.waitFor(() => {
      expect(document.querySelector('.t-color-picker__eyedropper-mask')).toBeTruthy();
    });
    controller.abort();

    expect(await promise).toBeNull();
    expect(document.querySelector('.t-color-picker__eyedropper-mask')).toBeNull();
  });

  it('uses fallback when native API is unavailable and fallback mode is requested', async () => {
    const html2canvas = vi.fn().mockResolvedValue(createCanvas([255, 102, 0]));

    const promise = openEyeDropper({ mode: 'fallback', html2canvas });
    await vi.waitFor(() => {
      expect(document.querySelector('.t-color-picker__eyedropper-mask')).toBeTruthy();
    });
    document.querySelector('.t-color-picker__eyedropper-mask')?.dispatchEvent(
      new MouseEvent('click', {
        clientX: 1,
        clientY: 1,
        bubbles: true,
      })
    );

    expect(await promise).toBe('#ff6600');
  });
});
