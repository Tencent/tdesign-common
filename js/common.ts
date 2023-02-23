export type PlainObject = { [key: string]: any };

export type OptionData = {
  label?: string;
  value?: string | number;
} & PlainObject;

export type TreeOptionData<T = string | number> = {
  children?: Array<TreeOptionData<T>>;
  /** option label content */
  label?: any;
  /** option search text */
  text?: string;
  /** option value */
  value?: T;
} & PlainObject;

export type SizeEnum = 'small' | 'medium' | 'large';

export type HorizontalAlignEnum = 'left' | 'center' | 'right';

export type VerticalAlignEnum = 'top' | 'middle' | 'bottom';

export type ClassName = { [className: string]: any } | ClassName[] | string;

export type CSSSelector = string;

export interface Styles {
  [css: string]: string | number;
}

export enum EKeyboardDirection {
  left = 37,
  up = 38,
  right = 39,
  down = 40,
}
