export interface DialogFocusable {
  /**
   * 打开后的默认焦点。
   * 未设置时默认聚焦对话框容器；`null` 不移动焦点。`confirm-button` 和 `cancel-button` 聚焦对应按钮；函数返回自定义元素。
   */
  defaultFocus?: null | 'confirm-button' | 'cancel-button' | (() => HTMLElement | null);
  /**
   * 是否将焦点限制在当前对话框内
   */
  focusTrap?: boolean;
  /**
   * 关闭后是否将焦点交还给打开对话框前的触发元素
   */
  focusTriggerAfterClose?: boolean;
}

export interface DialogFocusControllerOptions {
  classPrefix: string;
  isTop: () => boolean;
  getDialogEl: () => HTMLElement | null;
  getDialogCardEl: () => HTMLElement | null;
  getFocusable: () => DialogFocusable | undefined;
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const getFocusableElements = (container: HTMLElement) => {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((element) => {
    if (element.tabIndex < 0 || element.closest('[hidden], [aria-hidden="true"]')) return false;
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden';
  });
};

export class DialogFocusController {
  private options: DialogFocusControllerOptions;

  private trigger: HTMLElement | null = null;

  private wasVisible = false;

  private lastFocused: HTMLElement | null = null;

  private unbindTrap: (() => void) | null = null;

  constructor(options: DialogFocusControllerOptions) {
    this.options = options;
  }

  onVisibleChange(visible: boolean) {
    if (visible && !this.wasVisible && typeof document !== 'undefined') {
      this.trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    }
    this.wasVisible = visible;
  }

  focus() {
    this.getDefaultFocusElement()?.focus();
  }

  restore() {
    const { trigger } = this;
    this.trigger = null;
    if (this.options.getFocusable()?.focusTriggerAfterClose && trigger?.isConnected) trigger.focus();
  }

  unbind() {
    this.unbindTrap?.();
    this.unbindTrap = null;
  }

  bindTrap() {
    this.unbind();
    if (typeof document === 'undefined') return () => {};

    const focusFirst = () => {
      const dialogCard = this.options.getDialogCardEl();
      const focusableElements = dialogCard ? getFocusableElements(dialogCard) : [];
      (focusableElements[0] ?? this.options.getDialogEl())?.focus();
    };

    const handleFocusIn = (event: FocusEvent) => {
      if (!this.options.isTop()) return;
      const dialogEl = this.options.getDialogEl();
      const target = event.target as HTMLElement;
      if (dialogEl?.contains(target)) {
        this.lastFocused = target;
        return;
      }
      if (this.lastFocused && dialogEl?.contains(this.lastFocused)) {
        this.lastFocused.focus();
      } else {
        focusFirst();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !this.options.isTop()) return;
      const dialogEl = this.options.getDialogEl();
      const dialogCard = this.options.getDialogCardEl();
      const focusableElements = dialogCard ? getFocusableElements(dialogCard) : [];
      if (!focusableElements.length) {
        event.preventDefault();
        dialogEl?.focus();
        return;
      }

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      const { activeElement } = document;
      const isOutsideFocusableElements = !focusableElements.includes(activeElement as HTMLElement);
      if (
        (event.shiftKey && (activeElement === first || isOutsideFocusableElements)) ||
        (!event.shiftKey && activeElement === last)
      ) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('keydown', handleKeyDown);
    const stop = () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('keydown', handleKeyDown);
      this.lastFocused = null;
      if (this.unbindTrap === stop) this.unbindTrap = null;
    };
    this.unbindTrap = stop;
    return stop;
  }

  private getDefaultFocusElement() {
    const defaultFocus = this.options.getFocusable()?.defaultFocus;
    if (typeof defaultFocus === 'function') return defaultFocus();
    const dialogCard = this.options.getDialogCardEl();
    if (defaultFocus === 'confirm-button') {
      return dialogCard?.querySelector<HTMLElement>(`.${this.options.classPrefix}-dialog__confirm`) ?? null;
    }
    if (defaultFocus === 'cancel-button') {
      return dialogCard?.querySelector<HTMLElement>(`.${this.options.classPrefix}-dialog__cancel`) ?? null;
    }
    return defaultFocus === undefined ? this.options.getDialogEl() : null;
  }
}
