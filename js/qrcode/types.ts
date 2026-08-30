import type { Ecc, QrCode } from './qrcodegen';

export type Modules = ReturnType<QrCode['getModules']>;
export type Excavation = { x: number; y: number; w: number; h: number };
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';
export type CrossOrigin = 'anonymous' | 'use-credentials' | '' | undefined;

export type ERROR_LEVEL_MAPPED_TYPE = {
  [index in ErrorCorrectionLevel]: Ecc;
};

/**
 * Shape of each data module. Function modules (finder / alignment / timing /
 * format / version) are always the traditional solid square and ignore this.
 * - `square`      : original merged-solid-block look (default)
 * - `mini-square` : smaller solid squares (denser matrix)
 * - `rounded`     : rounded squares
 * - `dot`         : circles
 */
export type QrCodeModuleShape = 'square' | 'mini-square' | 'rounded' | 'dot';

/**
 * Options for styling the QR code. Omitting `shape` keeps the legacy
 * merged-solid-block rendering (fully backward compatible).
 */
export type QrCodeStyleOptions = {
  /** Shape of data modules. Defaults to `'square'`. */
  shape?: QrCodeModuleShape;
  /**
   * Side length / diameter of one data module as a percentage of one cell
   * (0~100). Overrides the per-shape default. Only affects `mini-square` and
   * `dot`; `rounded` derives its geometry from the cell.
   */
  scale?: number;
};

export type ImageSettings = {
  /**
   * The URI of the embedded image.
   */
  src: string;
  /**
   * The height, in pixels, of the image.
   */
  height: number;
  /**
   * The width, in pixels, of the image.
   */
  width: number;
  /**
   * Whether or not to "excavate" the modules around the embedded image. This
   * means that any modules the embedded image overlaps will use the background
   * color.
   */
  excavate: boolean;
  /**
   * The horizontal offset of the embedded image, starting from the top left corner.
   * Will center if not specified.
   */
  x?: number;
  /**
   * The vertical offset of the embedded image, starting from the top left corner.
   * Will center if not specified.
   */
  y?: number;
  /**
   * The opacity of the embedded image in the range of 0-1.
   * @defaultValue 1
   */
  opacity?: number;
  /**
   * The cross-origin value to use when loading the image. This is used to
   * ensure compatibility with CORS, particularly when extracting image data
   * from QRCodeCanvas.
   * Note: `undefined` is treated differently than the seemingly equivalent
   * empty string. This is intended to align with HTML behavior where omitting
   * the attribute behaves differently than the empty string.
   */
  crossOrigin?: CrossOrigin;
};
