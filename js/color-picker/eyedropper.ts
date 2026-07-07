declare class EyeDropper {
  open(options?: { signal?: AbortSignal }): Promise<{ sRGBHex: string }>;
}

declare global {
  interface Window {
    EyeDropper?: typeof EyeDropper;
  }
}

export const isEyeDropperSupported = (): boolean => typeof window !== 'undefined' && 'EyeDropper' in window;

export const openEyeDropper = async (): Promise<string | null> => {
  if (!isEyeDropperSupported()) return null;
  try {
    const eyeDropper = new window.EyeDropper!();
    const result = await eyeDropper.open();
    return result.sRGBHex;
  } catch {
    // user cancel (AbortError) or unsupported - both safe to swallow
    return null;
  }
};
