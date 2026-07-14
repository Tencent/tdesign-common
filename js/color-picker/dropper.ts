/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper/open#options
 */
export interface EyeDropperOpenOptions {
  signal?: AbortSignal
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper_API
 */
export interface EyeDropper {
  new(): EyeDropper
  open: (options?: EyeDropperOpenOptions) => Promise<{ sRGBHex: string }>
  [Symbol.toStringTag]: 'EyeDropper'
}

/** 取色器 */
export function useDropper() {
  const support = typeof window !== 'undefined' && 'EyeDropper' in window
  async function open(options?: EyeDropperOpenOptions) {
    if(!support) {
      return
    }

    const eyeDropper: EyeDropper = new (window as any).EyeDropper()
    const result = await eyeDropper.open(options)
    return result
  }


  return {
    support,
    open,
  }
}