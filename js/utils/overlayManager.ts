export type OverlayType = 'dialog' | 'drawer';

export interface OverlayEntry {
  readonly type: OverlayType;
  readonly getElement?: () => HTMLElement | null;
}

export class OverlayManager {
  private stack: OverlayEntry[] = [];

  register(entry: OverlayEntry) {
    this.stack.push(entry);
    return entry;
  }

  unregister(entry: OverlayEntry) {
    const index = this.stack.indexOf(entry);
    if (index === -1) return;

    const wasTop = index === this.stack.length - 1;
    this.stack.splice(index, 1);
    if (wasTop) this.focusTopOverlay();
  }

  isTop(entry: OverlayEntry) {
    return this.stack[this.stack.length - 1] === entry;
  }

  getTop() {
    return this.stack[this.stack.length - 1];
  }

  private focusTopOverlay() {
    const element = this.getTop()?.getElement?.();
    if (element?.isConnected) element.focus();
  }
}

export const overlayManager = new OverlayManager();
