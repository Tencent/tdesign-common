export interface EyeDropperResult {
  sRGBHex: string;
}

export interface EyeDropperOpenOptions {
  signal?: AbortSignal;
}

interface EyeDropperInstance {
  open(options?: EyeDropperOpenOptions): Promise<EyeDropperResult>;
}

interface EyeDropperConstructor {
  new(): EyeDropperInstance;
}

function getEyeDropperCtor(): EyeDropperConstructor | undefined {
  if (typeof globalThis === 'undefined') return undefined;
  const { EyeDropper } = globalThis as unknown as { EyeDropper?: unknown };
  return typeof EyeDropper === 'function' ? (EyeDropper as EyeDropperConstructor) : undefined;
}

export const isEyeDropperSupported = (): boolean => getEyeDropperCtor() !== undefined;

export const openEyeDropper = async (signal?: AbortSignal): Promise<string | null> => {
  const Ctor = getEyeDropperCtor();
  if (!Ctor) return null;
  try {
    const result = await new Ctor().open(signal ? { signal } : undefined);
    return result.sRGBHex;
  } catch {
    // user cancel (AbortError) or concurrent session - both safe to swallow
    return null;
  }
};
