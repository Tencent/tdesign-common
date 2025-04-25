export type BasicColorFormat = 'RGB' | 'HEX' | 'HSL' | 'HSV' | 'CMYK' | 'CSS';

export type AlphaColorFormat = 'RGBA' | 'HEX8' | 'HSLA' | 'HSVA';

export type ColorFormat = BasicColorFormat | AlphaColorFormat;

export interface ColorInputProp {
  key: string;
  min?: number;
  max?: number;
  type: 'input' | 'inputNumber';
  flex?: number;
  format?: Function;
}
