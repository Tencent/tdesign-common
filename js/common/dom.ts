import { Styles } from './types';

/**
 * 观察元素是否进入视口
 */
export function observe(
  element: HTMLElement,
  root: HTMLElement,
  callback: Function,
  marginBottom: number
): IntersectionObserver {
  if (typeof window === 'undefined') return null;
  if (!window || !window.IntersectionObserver) {
    callback();
    return null;
  }
  let io: IntersectionObserver = null;
  try {
    io = new window.IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          callback();
          io.unobserve(element);
        }
      },
      {
        rootMargin: `0px 0px ${marginBottom}px 0px`,
        root,
      }
    );
    io.observe(element);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    callback();
  }
  return io;
}

/**
 * 用于为节点增加 styles
 */
export function setStyle(el: HTMLElement, styles: Styles): void {
  const keys = Object.keys(styles);
  keys.forEach((key) => {
    // @ts-ignore
    // eslint-disable-next-line no-param-reassign
    el.style[key] = styles[key];
  });
}

/**
 * 注入样式到 document
 */
export function injectStyle(style: string): void {
  const styleElement = document.createElement('style');
  let styleSheet = null;
  document.head.appendChild(styleElement);
  styleSheet = styleElement.sheet;
  styleSheet.insertRule(style, styleSheet.cssRules.length);
}

/**
 * 获取 IE 浏览器版本
 */
export function getIEVersion(): number {
  if (typeof navigator === 'undefined' || !navigator) return Number.MAX_SAFE_INTEGER;

  const { userAgent } = navigator;
  const isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1;
  const isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
  if (isIE) {
    const reIE = /MSIE (\d+\.\d+);/;
    const match = userAgent.match(reIE);
    if (!match) return -1;
    const fIEVersion = parseFloat(match[1]);
    return fIEVersion < 7 ? 6 : fIEVersion;
  }
  if (isIE11) {
    return 11;
  }
  return Number.MAX_SAFE_INTEGER;
}

/**
 * 计算滚动条宽度（基于 CSS 设置）
 */
export function getScrollbarWidthWithCSS(): number {
  const defaultScrollbarWidth = 6;
  if (typeof navigator === 'undefined' || !navigator) return defaultScrollbarWidth;
  if (/(Chrome|Safari)/i.test(navigator.userAgent)) return defaultScrollbarWidth;
  const scrollDiv = document.createElement('div');
  scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
  document.body.appendChild(scrollDiv);
  let scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);
  if (/Firefox/.test(navigator.userAgent)) {
    scrollbarWidth -= 4;
  }
  if (getIEVersion() <= 11) {
    scrollbarWidth = 12;
  }
  return scrollbarWidth;
}

/**
 * 计算滚动条宽度
 */
export function getScrollbarWidth(container: HTMLElement = document.body): number {
  if (container === document.body) {
    return window.innerWidth - document.documentElement.clientWidth;
  }
  return container.offsetWidth - container.clientWidth;
}

/**
 * 检测是否需要 flex gap polyfill
 */
export function getFlexGapPolyFill(): boolean {
  if (typeof navigator === 'undefined' || !navigator) return false;
  const ua = navigator.userAgent;
  const chromeMatch = ua.match(/AppleWebKit.+Chrome\/(.+) Safari\/.+/i);
  if (Number(chromeMatch?.[1]?.split('.')[0]) < 100) return true;
  const safariMatch = ua.match(/AppleWebKit.+Version\/(.+) Safari\/.+/i);
  if (Number(safariMatch?.[1]?.split('.')[0]) < 12) return true;
  const ieVersion = getIEVersion();
  if (ieVersion <= 11) return true;
  const fireFoxMatch = ua.match(/Firefox\/(.+)/i);
  if (Number(fireFoxMatch?.[1]?.split('.')[0]) < 100) return true;
  return false;
}

const DOM_STYLE_PROPS = [
  'padding-top',
  'padding-bottom',
  'padding-left',
  'padding-right',
  'font-family',
  'font-weight',
  'font-size',
  'font-variant',
  'text-rendering',
  'text-transform',
  'width',
  'text-indent',
  'border-width',
  'box-sizing',
  'line-height',
  'letter-spacing',
];

/**
 * 计算 dom 元素盒模型尺寸
 */
export function calculateNodeSize(targetElement: HTMLElement) {
  if (typeof window === 'undefined') {
    return {
      paddingSize: 0,
      borderSize: 0,
      boxSizing: 0,
      sizingStyle: '',
    };
  }

  const style = window.getComputedStyle(targetElement);

  const boxSizing =
    style.getPropertyValue('box-sizing') ||
    style.getPropertyValue('-moz-box-sizing') ||
    style.getPropertyValue('-webkit-box-sizing');

  const paddingSize =
    parseFloat(style.getPropertyValue('padding-bottom')) + parseFloat(style.getPropertyValue('padding-top'));

  const borderSize =
    parseFloat(style.getPropertyValue('border-bottom-width')) + parseFloat(style.getPropertyValue('border-top-width'));

  const sizingStyle = DOM_STYLE_PROPS.map((name) => `${name}:${style.getPropertyValue(name)}`).join(';');

  return {
    paddingSize,
    borderSize,
    boxSizing,
    sizingStyle,
  };
}

type CalculateStyleType = {
  height?: string;
  minHeight?: string;
};

type LimitType = number | null;

const TEXTAREA_STYLE = `
  min-height:0 !important;
  max-height:none !important;
  height:0 !important;
  visibility:hidden !important;
  overflow:hidden !important;
  position:absolute !important;
  z-index:-1000 !important;
  top:0 !important;
  right:0 !important
`;

let hiddenTextarea: HTMLTextAreaElement;

/**
 * 计算 textarea 高度
 */
export function calcTextareaHeight(
  targetElement: HTMLTextAreaElement,
  minRows: LimitType = 1,
  maxRows: LimitType = null
): CalculateStyleType {
  if (!hiddenTextarea) {
    hiddenTextarea = document.createElement('textarea');
    document.body.appendChild(hiddenTextarea);
  }

  const { paddingSize, borderSize, boxSizing, sizingStyle } = calculateNodeSize(targetElement);

  hiddenTextarea.setAttribute('style', `${sizingStyle};${TEXTAREA_STYLE}`);
  hiddenTextarea.value = targetElement.value || targetElement.placeholder || '';

  let height = hiddenTextarea.scrollHeight;
  const result: CalculateStyleType = {};
  const isBorderbox = boxSizing === 'border-box';
  const isContentbox = boxSizing === 'content-box';

  if (isBorderbox) {
    height += borderSize;
  } else if (isContentbox) {
    height -= paddingSize;
  }

  hiddenTextarea.value = '';
  const singleRowHeight = hiddenTextarea.scrollHeight - paddingSize;
  hiddenTextarea?.parentNode?.removeChild(hiddenTextarea);
  // @ts-ignore
  hiddenTextarea = null;

  const calcHeight = (rows: number) => {
    let rowsHeight = singleRowHeight * rows;
    if (isBorderbox) {
      rowsHeight = rowsHeight + paddingSize + borderSize;
    }
    return rowsHeight;
  };

  if (minRows !== null) {
    const minHeight = calcHeight(minRows);
    height = Math.max(minHeight, height);
    result.minHeight = `${minHeight}px`;
  }
  if (maxRows !== null) {
    height = Math.min(calcHeight(maxRows), height);
  }
  result.height = `${height}px`;
  return result;
}

/**
 * 获取颜色 token 的色值
 * @example getColorTokenColor('--td-brand-color')
 */
export function getColorTokenColor(token: string): string {
  if (typeof window === 'undefined') return '';
  const targetElement = document?.documentElement;
  const styles = getComputedStyle(targetElement);
  return styles.getPropertyValue(token).trim() ?? '';
}
