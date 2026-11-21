declare module 'html2canvas-pro' {
  interface Html2CanvasOptions {
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

  const html2canvas: (element: HTMLElement, options?: Html2CanvasOptions) => Promise<HTMLCanvasElement>;

  export default html2canvas;
}
