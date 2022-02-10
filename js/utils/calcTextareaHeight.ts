/**
 * Thanks to https://github.com/ElemeFE/element/blob/dev/packages/input/src/calcTextareaHeight.js
 */
type RowsType = number | null;

type ResultType = {
  height?: string,
  minHeight?: string
};

let hiddenTextarea: HTMLTextAreaElement;

const HIDDEN_TEXTAREA_STYLE = `
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

/**
 * 计算dom元素盒模型尺寸
 * @param targetElement 需要计算盒模型尺寸的元素
 * @returns 计算出各维度尺寸。
 */
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

function calculateNodeSize(targetElement: HTMLElement) {
  const style = window.getComputedStyle(targetElement);

  const boxSizing = style.getPropertyValue('box-sizing')
    || style.getPropertyValue('-moz-box-sizing')
    || style.getPropertyValue('-webkit-box-sizing');

  const paddingSize = (
    parseFloat(style.getPropertyValue('padding-bottom'))
    + parseFloat(style.getPropertyValue('padding-top'))
  );

  const borderSize = (
    parseFloat(style.getPropertyValue('border-bottom-width'))
    + parseFloat(style.getPropertyValue('border-top-width'))
  );

  const sizingStyle = DOM_STYLE_PROPS
    .map((name) => `${name}:${style.getPropertyValue(name)}`)
    .join(';');

  return {
    paddingSize, borderSize, boxSizing, sizingStyle,
  };
}

function calcTextareaHeight(
  targetElement: HTMLTextAreaElement,
  minRows: RowsType = 1,
  maxRows: RowsType = null,
): ResultType {
  if (!hiddenTextarea) {
    hiddenTextarea = document.createElement('textarea');
    document.body.appendChild(hiddenTextarea);
  }

  const {
    paddingSize,
    borderSize,
    boxSizing,
    sizingStyle,
  } = calculateNodeSize(targetElement);

  hiddenTextarea.setAttribute('style', `${sizingStyle};${HIDDEN_TEXTAREA_STYLE}`);
  hiddenTextarea.value = targetElement.value || targetElement.placeholder || '';

  let height = hiddenTextarea.scrollHeight;
  const result: ResultType = {};
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

export default calcTextareaHeight;
