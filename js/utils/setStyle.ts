import { Styles } from '../common';

/**
 * 用于为节点增加styles
 * @param el HTMLElement
 * @param styles Styles
 */
function setStyle(el: HTMLElement, styles: Styles): void {
  if (!el) return;

  const keys = Object.keys(styles);
  keys.forEach((key) => {
    // @ts-ignore
    // eslint-disable-next-line no-param-reassign
    el.style[key] = styles[key];
  });
  // TODO: 这个怎么样
  // Object.assign(el.style, styles);
}

export default setStyle;
