/**
 * 判定并同步表单中需要清除底部间距的末位表单项。
 */

// 不参与后续内容判定的文档节点
const IGNORE_TAGS = new Set(['SCRIPT', 'STYLE', 'LINK', 'META', 'NOSCRIPT']);
// 具备独立交互或媒体语义的元素，视为后续有效内容
const MEANINGFUL_TAGS = new Set(['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'IMG', 'SVG', 'VIDEO', 'CANVAS', 'IFRAME']);

/**
 * 末位表单项控制器的初始化与更新参数。
 */
export interface LastFormItemOptions {
  // 组件类名前缀，缺省为 t
  classPrefix?: string;
  // 为 true 时跳过计算
  disabled?: boolean;
}

/**
 * 判断元素当前是否处于隐藏状态。
 */
function isHidden(el: HTMLElement) {
  if (el.hidden || el.style.display === 'none') return true;
  return typeof getComputedStyle === 'function' && getComputedStyle(el).display === 'none';
}

/**
 * 判断元素是否具备可测量的布局尺寸。
 */
function isLayoutMeasurable(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  return rect.width > 0 || rect.height > 0;
}

/**
 * 判断表单项是否嵌套在另一表单项内部。
 */
function isNestedFormItem(item: HTMLElement, formElement: HTMLElement, formItemSelector: string) {
  const parentFormItem = item.parentElement?.closest<HTMLElement>(formItemSelector);
  return Boolean(parentFormItem && formElement.contains(parentFormItem));
}

/**
 * 判断文档位置掩码是否包含指定标记。
 */
function hasDocumentPosition(position: number, flag: number) {
  return Math.floor(position / flag) % 2 === 1;
}

/**
 * 按文档顺序排列表单项。
 */
function sortByDocumentOrder(items: HTMLElement[]) {
  return items.sort((a, b) =>
    hasDocumentPosition(a.compareDocumentPosition(b), Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1
  );
}

/**
 * 判断节点是否构成表单项之后的有效内容。
 */
function isMeaningfulNode(node: Node, registeredItems: Set<HTMLElement>, formItemClassName: string): boolean {
  if (node.nodeType === Node.COMMENT_NODE) return false;
  if (node.nodeType === Node.TEXT_NODE) return Boolean(node.textContent?.trim());
  if (node.nodeType !== Node.ELEMENT_NODE) return false;

  const el = node as HTMLElement;
  if (IGNORE_TAGS.has(el.tagName) || isHidden(el)) return false;

  // 卸载过程中节点可能尚未移出 DOM，仅已注册项计入后续内容
  if (el.classList.contains(formItemClassName)) return registeredItems.has(el);
  if (MEANINGFUL_TAGS.has(el.tagName)) return true;

  if (Array.from(el.childNodes).some((child) => isMeaningfulNode(child, registeredItems, formItemClassName))) {
    return true;
  }

  // 空容器但具备盒尺寸，且内部不含表单项时视为占位内容
  return isLayoutMeasurable(el) && !el.querySelector(`.${formItemClassName}`);
}

/**
 * 判断指定边界内表单项之后是否仍存在有效内容。
 */
function hasMeaningfulContentAfter(
  boundary: HTMLElement,
  item: HTMLElement,
  registeredItems: Set<HTMLElement>,
  formItemClassName: string
) {
  let node: Node | null = item;
  while (node && node !== boundary) {
    let sibling = node.nextSibling;
    while (sibling) {
      if (isMeaningfulNode(sibling, registeredItems, formItemClassName)) return true;
      sibling = sibling.nextSibling;
    }
    // 当前层无后续兄弟后，继续检查祖先节点的后续兄弟
    node = node.parentNode;
  }
  return false;
}

/**
 * 返回与文档序最后一项处于同一行的表单项。
 */
function getLastRowItems(items: HTMLElement[]) {
  if (!items.length) return [];
  const last = items[items.length - 1];
  // 无法取得有效布局尺寸时，仅保留文档序最后一项
  if (!isLayoutMeasurable(last)) return [last];

  const lastTop = last.getBoundingClientRect().top;
  // 允许 1px 误差
  return items.filter((item) => Math.abs(item.getBoundingClientRect().top - lastTop) <= 1);
}

/**
 * 判断元素是否为带有底部内边距的内容容器。
 */
function isContentBox(el: HTMLElement) {
  if (typeof getComputedStyle !== 'function') return false;
  // 底部内边距大于 0 时，末项再保留 margin-bottom 会与容器内边距叠加
  return parseFloat(getComputedStyle(el).paddingBottom || '0') > 0;
}

/**
 * 返回表单项与表单之间最近的内容容器。
 */
function getNearestContentBox(item: HTMLElement, formElement: HTMLElement) {
  let node = item.parentElement;
  while (node && node !== formElement) {
    if (isContentBox(node)) return node;
    node = node.parentElement;
  }
  return null;
}

/**
 * 收集各内容容器内应当标记为末位的表单项。
 */
function getContentBoxLastItems(
  formElement: HTMLElement,
  formItems: HTMLElement[],
  registeredItems: Set<HTMLElement>,
  formItemClassName: string
) {
  // 按最近内容容器归组，避免普通布局包裹被误判为独立末位分组
  const grouped = new Map<HTMLElement, HTMLElement[]>();
  formItems.forEach((item) => {
    const box = getNearestContentBox(item, formElement);
    if (!box) return;
    const siblings = grouped.get(box);
    if (siblings) siblings.push(item);
    else grouped.set(box, [item]);
  });

  const lastItems: HTMLElement[] = [];
  grouped.forEach((items, box) => {
    const last = items[items.length - 1];
    // 容器内末项之后仍有操作按钮等内容时，不清除该组底部间距
    if (hasMeaningfulContentAfter(box, last, registeredItems, formItemClassName)) return;
    getLastRowItems(items).forEach((item) => lastItems.push(item));
  });
  return lastItems;
}

/**
 * 返回当前表单中应当应用末位样式的表单项。
 */
function resolveLastFormItems(
  formElement: HTMLElement,
  registeredItems: Iterable<HTMLElement>,
  formItemClassName: string
) {
  const formItemSelector = `.${formItemClassName}`;
  const registeredSet = registeredItems instanceof Set ? registeredItems : new Set(registeredItems);
  const formItems = sortByDocumentOrder(
    [...registeredSet].filter((item) => {
      if (!formElement.contains(item) || isHidden(item)) return false;
      // 嵌套表单项由外层项参与布局判定
      return !isNestedFormItem(item, formElement, formItemSelector);
    })
  );

  if (!formItems.length) return [];

  const lastItems = new Set(getContentBoxLastItems(formElement, formItems, registeredSet, formItemClassName));
  const lastFormItem = formItems[formItems.length - 1];
  // 表单末项之后无有效内容时，标记整表最后一行
  if (!hasMeaningfulContentAfter(formElement, lastFormItem, registeredSet, formItemClassName)) {
    getLastRowItems(formItems).forEach((item) => lastItems.add(item));
  }
  return [...lastItems];
}

/**
 * 维护表单末位项的注册、观测与样式类同步。
 */
export class LastFormItemController {
  private classPrefix: string;

  private disabled: boolean;

  // 当前绑定的表单根节点
  private formElement: HTMLElement | null = null;

  // 已注册的表单项节点
  private items = new Set<HTMLElement>();

  // 当前带有末位类的节点
  private lastItems = new Set<HTMLElement>();

  private mutationObserver: MutationObserver | null = null;

  private resizeObserver: ResizeObserver | null = null;

  /**
   * 创建末位表单项控制器。
   */
  constructor(options: LastFormItemOptions = {}) {
    this.classPrefix = options.classPrefix || 't';
    this.disabled = Boolean(options.disabled);
  }

  /**
   * 返回末位样式类名。
   */
  private get lastClassName() {
    return `${this.classPrefix}-form__item--last`;
  }

  /**
   * 返回表单项根节点类名。
   */
  private get formItemClassName() {
    return `${this.classPrefix}-form__item`;
  }

  /**
   * 按最新配置刷新状态。
   */
  update(options: LastFormItemOptions) {
    const nextPrefix = options.classPrefix || this.classPrefix;
    if (nextPrefix !== this.classPrefix) {
      this.clearLastClass();
      this.classPrefix = nextPrefix;
    }
    if (options.disabled !== undefined) this.disabled = options.disabled;
    this.refresh();
  }

  /**
   * 将控制器绑定到指定表单根节点。
   */
  bind(formElement: HTMLElement | null) {
    if (this.formElement === formElement) {
      // 同一节点重复绑定时仅重新计算，避免断开已有观测
      this.refresh();
      return;
    }
    this.unbind();
    this.formElement = formElement;
    if (!formElement) return;
    this.connectObservers();
    this.refresh();
  }

  /**
   * 注册表单项节点，并返回对应的注销函数。
   */
  register(node: HTMLElement) {
    this.items.add(node);
    this.refresh();

    return () => {
      this.items.delete(node);
      node.classList.remove(this.lastClassName);
      this.lastItems.delete(node);
      this.refresh();
    };
  }

  /**
   * 按当前注册项重新计算并同步末位样式类。
   */
  refresh() {
    const nextLastItems = new Set<HTMLElement>();
    if (!this.disabled && this.formElement) {
      resolveLastFormItems(this.formElement, this.items, this.formItemClassName).forEach((item) => {
        nextLastItems.add(item);
      });
    }

    this.lastItems.forEach((item) => {
      if (!nextLastItems.has(item)) item.classList.remove(this.lastClassName);
    });
    nextLastItems.forEach((item) => {
      item.classList.add(this.lastClassName);
    });
    this.lastItems = nextLastItems;
  }

  /**
   * 解除与当前表单根节点的绑定，并断开观测。
   */
  unbind() {
    this.disconnectObservers();
    this.formElement = null;
  }

  /**
   * 销毁控制器并清除全部注册状态。
   */
  destroy() {
    this.unbind();
    this.clearLastClass();
    this.items.clear();
  }

  /**
   * 移除已标记节点上的末位样式类。
   */
  private clearLastClass() {
    this.lastItems.forEach((item) => item.classList.remove(this.lastClassName));
    this.lastItems.clear();
  }

  /**
   * 监听表单结构与尺寸变化以触发重新计算。
   */
  private connectObservers() {
    if (!this.formElement) return;

    this.mutationObserver = new MutationObserver(() => this.refresh());
    this.mutationObserver.observe(this.formElement, { childList: true, subtree: true });

    if (typeof ResizeObserver === 'undefined') return;
    this.resizeObserver = new ResizeObserver(() => this.refresh());
    this.resizeObserver.observe(this.formElement);
  }

  /**
   * 断开结构观测与尺寸观测。
   */
  private disconnectObservers() {
    this.mutationObserver?.disconnect();
    this.resizeObserver?.disconnect();
    this.mutationObserver = null;
    this.resizeObserver = null;
  }
}
