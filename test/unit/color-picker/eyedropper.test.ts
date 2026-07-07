import { describe, it, expect, vi, afterEach } from 'vitest';
import { isEyeDropperSupported, openEyeDropper } from '../../../js/color-picker/eyedropper';

afterEach(() => {
  vi.unstubAllGlobals();
});

class MockEyeDropper {
  constructor(private hex: string) {}
  open() {
    return Promise.resolve({ sRGBHex: this.hex });
  }
}

class AbortingEyeDropper {
  open() {
    return Promise.reject(new DOMException('User aborted', 'AbortError'));
  }
}

class FailingEyeDropper {
  open() {
    return Promise.reject(new Error('hardware error'));
  }
}

describe('isEyeDropperSupported', () => {
  it('returns false in SSR (no window)', () => {
    // default Node test env has no window
    expect(isEyeDropperSupported()).toBe(false);
  });

  it('returns false when window exists but EyeDropper is absent', () => {
    vi.stubGlobal('window', {});
    expect(isEyeDropperSupported()).toBe(false);
  });

  it('returns true when EyeDropper is present on window', () => {
    vi.stubGlobal('window', { EyeDropper: class {} });
    expect(isEyeDropperSupported()).toBe(true);
  });
});

describe('openEyeDropper', () => {
  it('returns null when EyeDropper is not supported', async () => {
    // no window stub → SSR-like environment
    expect(await openEyeDropper()).toBeNull();
  });

  it('returns the selected hex color on success', async () => {
    vi.stubGlobal('window', { EyeDropper: class { open() { return Promise.resolve({ sRGBHex: '#ff6600' }); } } });
    const result = await openEyeDropper();
    expect(result).toBe('#ff6600');
  });

  it('returns null when user cancels (AbortError)', async () => {
    vi.stubGlobal('window', { EyeDropper: AbortingEyeDropper });
    expect(await openEyeDropper()).toBeNull();
  });

  it('returns null on any unexpected error from open()', async () => {
    vi.stubGlobal('window', { EyeDropper: FailingEyeDropper });
    expect(await openEyeDropper()).toBeNull();
  });
});
