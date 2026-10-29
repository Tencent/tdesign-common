/**
 * 判定并同步表单中需要清除底部间距的末位表单项。
 */

// 不参与后续内容判定的文档节点
const IGNORE_TAGS = new Set(['SCRIPT', 'STYLE', 'LINK', 'META', 'NOSCRIPT']);
// 具备独立交互或媒体语义的元素，视为后续有效内容
const MEANINGFUL_TAGS = new Set(['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'IMG', 'SVG', 'VIDEO', 'CANVAS', 'IFRAME']);

export interface LastFormItemOptions {
  /**
   * 组件类名前缀，缺省为 t。
   */
  classPrefix?: string;
  /**
   * 是否跳过末位项计算。
   */
  disabled?: boolean;
}

/**
 * 判断元素是否处于隐藏状态。
 */
function isHidden(el: HTMLElement) {
  if (el.hidden || el.style.display === 'none') return true;
  return typeof getComputedStyle === 'function' && getComputedStyle(el).display === 'none';
}

/**
 * 判断元素是否具有可测量的布局尺寸。
 */
function isLayoutMeasurable(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  return rect.width > 0 || rect.height > 0;
}

/**
 * 判断表单项是否嵌套在同一表单的其他表单项中。
 */
function isNestedFormItem(item: HTMLElement, formElement: HTMLElement, formItemSelector: string) {
  const parentFormItem = item.parentElement?.closest<HTMLElement>(formItemSelector);
  return Boolean(parentFormItem && formElement.contains(parentFormItem));
}

/**
 * 判断文档位置掩码是否包含指定标记。
 */
function hasDocumentPosition(position: number, flag: number) {
  // compareDocumentPosition 返回位掩码
  // eslint-disable-next-line no-bitwise
  return (position & flag) !== 0;
}

/**
 * 按文档顺序排列元素。
 */
function sortByDocumentOrder(items: HTMLElement[]) {
  return items.sort((a, b) => {
    if (a === b) return 0;

    const position = a.compareDocumentPosition(b);

    // 正常情况下，传入的节点都在同一表单内；断开连接时不强行指定顺序。
    if (hasDocumentPosition(position, Node.DOCUMENT_POSITION_DISCONNECTED)) return 0;
    if (hasDocumentPosition(position, Node.DOCUMENT_POSITION_FOLLOWING)) return -1;
    if (hasDocumentPosition(position, Node.DOCUMENT_POSITION_PRECEDING)) return 1;

    return 0;
  });
}

/**
 * 判断节点是否构成表单项之后的有效内容。
 */
function isMeaningfulNode(node: Node, registeredItems: Set<HTMLElement>, formItemClassName: string) {
  if (node.nodeType === Node.COMMENT_NODE) return false;
  if (node.nodeType === Node.TEXT_NODE) return Boolean(node.textContent?.trim());
  if (node.nodeType !== Node.ELEMENT_NODE) return false;

  const el = node as HTMLElement;

  if (IGNORE_TAGS.has(el.tagName) || isHidden(el)) return false;

  // 卸载过程中节点可能尚未移出 DOM，仅已注册项计入后续内容
  if (el.classList.contains(formItemClassName)) {
    return registeredItems.has(el);
  }

  if (MEANINGFUL_TAGS.has(el.tagName)) return true;

  if (Array.from(el.childNodes).some((child) => isMeaningfulNode(child, registeredItems, formItemClassName))) {
    return true;
  }

  // 空容器但具备盒尺寸，且内部不含表单项时视为占位内容
  return isLayoutMeasurable(el) && !el.querySelector(`.${formItemClassName}`);
}

/**
 * 判断指定边界内的表单项之后是否存在有效内容。
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
 * 获取与文档末项处于同一视觉行的表单项。
 */
function getLastRowItems(items: HTMLElement[]): HTMLElement[] {
  if (!items.length) return [];
  const last = items[items.length - 1];
  // 无法取得有效布局尺寸时，仅保留文档序最后一项
  if (!isLayoutMeasurable(last)) return [last];

  const lastTop = last.getBoundingClientRect().top;
  // 允许 1px 误差
  return items.filter((item) => Math.abs(item.getBoundingClientRect().top - lastTop) <= 1);
}

/**
 * 判断元素是否为具有底部内边距的内容容器。
 */
function isContentBox(el: HTMLElement): boolean {
  if (typeof getComputedStyle !== 'function') return false;
  // 底部内边距大于 0 时，避免末项保留 margin-bottom 与容器内边距叠加
  return parseFloat(getComputedStyle(el).paddingBottom || '0') > 0;
}

/**
 * 获取表单项与表单根节点之间最近的内容容器。
 */
function getNearestContentBox(item: HTMLElement, formElement: HTMLElement): HTMLElement | null {
  let node = item.parentElement;
  while (node && node !== formElement) {
    if (isContentBox(node)) return node;
    node = node.parentElement;
  }
  return null;
}

/**
 * 获取各内容容器中需要清除底部间距的末位表单项。
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
    if (siblings) {
      siblings.push(item);
    } else {
      grouped.set(box, [item]);
    }
  });

  const lastItems: HTMLElement[] = [];

  grouped.forEach((items, box) => {
    const last = items[items.length - 1];

    // 容器内末项之后仍有操作按钮等内容时，不清除该组底部间距。
    if (hasMeaningfulContentAfter(box, last, registeredItems, formItemClassName)) {
      return;
    }

    lastItems.push(...getLastRowItems(items));
  });

  return lastItems;
}

/**
 * 计算表单中需要清除底部间距的末位表单项。
 */
function resolveLastFormItems(formElement: HTMLElement, registeredItems: Set<HTMLElement>, formItemClassName: string) {
  const formItemSelector = `.${formItemClassName}`;

  const formItems = sortByDocumentOrder(
    [...registeredItems].filter((item) => {
      if (!formElement.contains(item) || isHidden(item)) return false;
      // 嵌套表单项由外层项参与布局判定
      return !isNestedFormItem(item, formElement, formItemSelector);
    })
  );

  if (!formItems.length) return [];

  const lastItems = new Set(getContentBoxLastItems(formElement, formItems, registeredItems, formItemClassName));

  const lastFormItem = formItems[formItems.length - 1];

  // 表单末项之后无有效内容时，标记整表最后一行。
  if (!hasMeaningfulContentAfter(formElement, lastFormItem, registeredItems, formItemClassName)) {
    getLastRowItems(formItems).forEach((item) => lastItems.add(item));
  }

  return [...lastItems];
}

/**
 * 维护表单末位项状态并同步对应样式类。
 */
export class LastFormItemController {
  private classPrefix: string;

  private disabled: boolean;

  // 当前绑定的表单根节点
  private formElement: HTMLElement | null = null;

  // 已注册的表单项节点
  private readonly items = new Set<HTMLElement>();

  // 当前带有末位类的节点
  private lastItems = new Set<HTMLElement>();

  private mutationObserver: MutationObserver | null = null;

  private resizeObserver: ResizeObserver | null = null;

  constructor(options: LastFormItemOptions = {}) {
    this.classPrefix = options.classPrefix || 't';
    this.disabled = Boolean(options.disabled);
  }

  /**
   * 获取末位表单项的样式类名。
   */
  private get lastClassName(): string {
    return `${this.classPrefix}-form__item--last`;
  }

  /**
   * 获取表单项的基础样式类名。
   */
  private get formItemClassName(): string {
    return `${this.classPrefix}-form__item`;
  }

  /**
   * 更新控制器配置并同步末位项状态。
   */
  update(options: LastFormItemOptions): void {
    const nextPrefix = options.classPrefix || this.classPrefix;

    if (nextPrefix !== this.classPrefix) {
      this.clearLastClass();
      this.classPrefix = nextPrefix;
    }

    if (options.disabled !== undefined) {
      this.disabled = options.disabled;
    }

    this.refresh();
  }

  /**
   * 绑定表单根节点并同步末位项状态。
   */
  bind(formElement: HTMLElement | null): void {
    if (this.formElement === formElement) {
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
   * 注册参与末位判定的表单项，并返回注销函数。
   */
  register(node: HTMLElement): () => void {
    this.items.add(node);
    this.resizeObserver?.observe(node);
    this.refresh();

    let registered = true;

    return () => {
      if (!registered) return;
      registered = false;

      this.resizeObserver?.unobserve(node);
      this.items.delete(node);
      node.classList.remove(this.lastClassName);
      this.refresh();
    };
  }

  /**
   * 根据当前 DOM 结构与布局重新计算并同步末位项状态。
   */
  refresh(): void {
    const nextLastItems = new Set<HTMLElement>();

    if (!this.disabled && this.formElement) {
      resolveLastFormItems(this.formElement, this.items, this.formItemClassName).forEach((item) =>
        nextLastItems.add(item)
      );
    }

    this.lastItems.forEach((item) => {
      if (!nextLastItems.has(item)) {
        item.classList.remove(this.lastClassName);
      }
    });

    nextLastItems.forEach((item) => {
      item.classList.add(this.lastClassName);
    });

    this.lastItems = nextLastItems;
    // 当前同步过程产生的 class 变更已经纳入本次计算，无需再次触发完整计算
    this.mutationObserver?.takeRecords();
  }

  /**
   * 解除根节点绑定并停止相关观察任务。
   */
  unbind(): void {
    this.disconnectObservers();
    this.formElement = null;
  }

  /**
   * 销毁控制器并清理其维护的全部状态。
   */
  destroy(): void {
    this.unbind();
    this.clearLastClass();

    this.items.clear();
  }

  /**
   * 移除当前末位项的样式类并清空相关记录。
   */
  private clearLastClass(): void {
    this.lastItems.forEach((item) => {
      item.classList.remove(this.lastClassName);
    });

    this.lastItems.clear();
  }

  /**
   * 建立表单结构与布局尺寸的变化观察器。
   */
  private connectObservers(): void {
    const { formElement } = this;
    if (!formElement) return;

    if (typeof MutationObserver !== 'undefined') {
      this.mutationObserver = new MutationObserver(() => {
        this.refresh();
      });

      this.mutationObserver.observe(formElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style', 'hidden'],
      });
    }

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.refresh();
      });

      this.resizeObserver.observe(formElement);
      this.items.forEach((item) => {
        if (formElement.contains(item)) {
          this.resizeObserver?.observe(item);
        }
      });
    }
  }

  /**
   * 断开当前根节点的全部变化观察器。
   */
  private disconnectObservers(): void {
    this.mutationObserver?.disconnect();
    this.resizeObserver?.disconnect();
    this.mutationObserver = null;
    this.resizeObserver = null;
  }
}
