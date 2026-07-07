// @vitest-environment jsdom
/* eslint-disable max-classes-per-file */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { isEyeDropperSupported, openEyeDropper } from '../../../js/color-picker/eyedropper';

afterEach(() => {
  vi.unstubAllGlobals();
});

class MockEyeDropper {
  // eslint-disable-next-line no-useless-constructor, no-empty-function
  constructor(private hex: string = '#aabbcc') {}

  open(_opts?: { signal?: AbortSignal }) {
    return Promise.resolve({ sRGBHex: this.hex });
  }
}

class AbortingEyeDropper {
  // eslint-disable-next-line class-methods-use-this
  open() {
    return Promise.reject(new DOMException('User aborted', 'AbortError'));
  }
}

class FailingEyeDropper {
  // eslint-disable-next-line class-methods-use-this
  open() {
    return Promise.reject(new Error('hardware error'));
  }
}

describe('isEyeDropperSupported', () => {
  it('returns false when EyeDropper is absent from globalThis', () => {
    // default Node test env has no EyeDropper
    expect(isEyeDropperSupported()).toBe(false);
  });

  it('returns false when the EyeDropper global is not a function', () => {
    vi.stubGlobal('EyeDropper', 'not-a-constructor');
    expect(isEyeDropperSupported()).toBe(false);
  });

  it('returns true when EyeDropper is a constructor on globalThis', () => {
    vi.stubGlobal('EyeDropper', class {});
    expect(isEyeDropperSupported()).toBe(true);
  });
});

describe('openEyeDropper', () => {
  it('returns null when EyeDropper is not available', async () => {
    expect(await openEyeDropper()).toBeNull();
  });

  it('returns the picked hex color on success', async () => {
    vi.stubGlobal(
      'EyeDropper',
      class extends MockEyeDropper {
        constructor() {
          super('#ff6600');
        }
      }
    );
    expect(await openEyeDropper()).toBe('#ff6600');
  });

  it('forwards an AbortSignal to open()', async () => {
    const openSpy = vi.fn().mockResolvedValue({ sRGBHex: '#112233' });
    vi.stubGlobal(
      'EyeDropper',
      class {
        open = openSpy;
      }
    );
    const controller = new AbortController();
    await openEyeDropper(controller.signal);
    expect(openSpy).toHaveBeenCalledWith({ signal: controller.signal });
  });

  it('calls open() without options when no signal provided', async () => {
    const openSpy = vi.fn().mockResolvedValue({ sRGBHex: '#112233' });
    vi.stubGlobal(
      'EyeDropper',
      class {
        open = openSpy;
      }
    );
    await openEyeDropper();
    expect(openSpy).toHaveBeenCalledWith(undefined);
  });

  it('returns null when user cancels (AbortError)', async () => {
    vi.stubGlobal('EyeDropper', AbortingEyeDropper);
    expect(await openEyeDropper()).toBeNull();
  });

  it('returns null on any unexpected error from open()', async () => {
    vi.stubGlobal('EyeDropper', FailingEyeDropper);
    expect(await openEyeDropper()).toBeNull();
  });
});
