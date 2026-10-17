import { ref, onMounted, onUnmounted, type Ref } from 'vue';

export type DragEventLike = MouseEvent | TouchEvent | { clientX: number; clientY: number; preventDefault?: () => void };

export interface UseTabBarDragOptions {
  tabbarRef: Ref<HTMLElement | null>;
  onTabClick?: (key: string) => void;
  /** Threshold in ms to detect double-tap / double-click */
  doubleTapThreshold?: number;
}

export interface UseTabBarDragReturn {
  activeTab: Ref<string>;
  pressedTab: Ref<string | null>;
  isDragging: Ref<boolean>;
}

function getClientCoords(e: DragEventLike): { clientX: number; clientY: number } {
  if ('touches' in e && e.touches.length > 0) {
    return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
  }
  if ('clientX' in e && 'clientY' in e) {
    return { clientX: e.clientX, clientY: e.clientY };
  }
  return { clientX: 0, clientY: 0 };
}

function isTabItemClick(target: HTMLElement | null): boolean {
  let current: HTMLElement | null = target;
  while (current) {
    if (current.classList && current.classList.contains('tab-item')) {
      return true;
    }
    current = current.parentElement;
  }
  return false;
}

function clampPosition(
  left: number,
  top: number,
  tabbar: HTMLElement,
): { left: number; top: number } {
  const rect = tabbar.getBoundingClientRect();
  const winW = window.innerWidth;
  const winH = window.innerHeight;
  const w = rect.width || 420;
  const h = rect.height || 80;

  const minX = 10;
  const maxX = winW - w - 10;
  const minY = 60;
  const maxY = winH - h - 60;

  return {
    left: Math.min(maxX, Math.max(minX, left)),
    top: Math.min(maxY, Math.max(minY, top)),
  };
}

function initDragPosition(tabbar: HTMLElement): void {
  const style = window.getComputedStyle(tabbar);
  if (style.position !== 'fixed') {
    tabbar.style.position = 'fixed';
    tabbar.style.left = '50%';
    tabbar.style.bottom = '30px';
    tabbar.style.top = 'auto';
    tabbar.style.transform = 'translateX(-50%) perspective(1200px) rotateX(2deg) rotateY(-1.5deg)';
  }

  const rect = tabbar.getBoundingClientRect();
  const winW = window.innerWidth;

  if (!tabbar.style.left || tabbar.style.left === 'auto') {
    tabbar.style.left = winW / 2 - rect.width / 2 + 'px';
    tabbar.style.bottom = '30px';
    tabbar.style.top = 'auto';
  }

  tabbar.style.transform = 'perspective(1200px) rotateX(2deg) rotateY(-1.5deg)';
  tabbar.style.willChange = 'transform, left, top';
}

export function useTabBarDrag(options: UseTabBarDragOptions): UseTabBarDragReturn {
  const { tabbarRef, onTabClick, doubleTapThreshold = 100 } = options;

  const activeTab = ref<string>('');
  const pressedTab = ref<string | null>(null);
  const isDragging = ref<boolean>(false);
  const lastTapTime = ref<number>(0);

  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let startX = 0;
  let startY = 0;
  let startTabX = 0;
  let startTabY = 0;

  let mouseMoveHandler: ((e: MouseEvent) => void) | null = null;
  let mouseUpHandler: (() => void) | null = null;
  let touchMoveHandler: ((e: TouchEvent) => void) | null = null;
  let touchEndHandler: (() => void) | null = null;
  let touchCancelHandler: (() => void) | null = null;
  let resizeHandler: (() => void) | null = null;

  function setActive(key: string): void {
    activeTab.value = key;
    if (navigator.vibrate) navigator.vibrate(2);
  }

  function handlePressStart(key: string): void {
    if (pressedTab.value) return;
    pressedTab.value = key;
  }

  function handlePressEnd(key: string, shouldActivate: boolean = true): void {
    if (pressedTab.value !== key) return;
    pressedTab.value = null;

    if (shouldActivate) {
      const now = Date.now();
      if (now - lastTapTime.value > doubleTapThreshold) {
        setActive(key);
        lastTapTime.value = now;
        onTabClick?.(key);
      }
    }
  }

  function handleMouseLeave(key: string): void {
    if (pressedTab.value === key) {
      pressedTab.value = null;
    }
  }

  function startDrag(e: DragEventLike): void {
    const tabbar = tabbarRef.value;
    if (!tabbar) return;

    if (isTabItemClick(e.target as HTMLElement)) return;

    if (e.preventDefault) e.preventDefault();

    const { clientX, clientY } = getClientCoords(e);
    const rect = tabbar.getBoundingClientRect();

    const style = window.getComputedStyle(tabbar);
    if (style.position !== 'fixed') {
      tabbar.style.position = 'fixed';
      tabbar.style.left = rect.left + 'px';
      tabbar.style.top = rect.top + 'px';
      tabbar.style.bottom = 'auto';
      tabbar.style.transform = 'perspective(1200px) rotateX(2deg) rotateY(-1.5deg)';
    }

    dragOffsetX = clientX - rect.left;
    dragOffsetY = clientY - rect.top;
    startX = clientX;
    startY = clientY;
    startTabX = parseFloat(tabbar.style.left) || rect.left;
    startTabY = parseFloat(tabbar.style.top) || rect.top;

    isDragging.value = true;
    tabbar.classList.add('dragging');
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  }

  function moveDrag(e: DragEventLike): void {
    const tabbar = tabbarRef.value;
    if (!isDragging.value || !tabbar) return;
    if (e.preventDefault) e.preventDefault();

    const { clientX, clientY } = getClientCoords(e);
    const deltaX = clientX - startX;
    const deltaY = clientY - startY;

    const newLeft = startTabX + deltaX;
    const newTop = startTabY + deltaY;

    const clamped = clampPosition(newLeft, newTop, tabbar);
    tabbar.style.left = clamped.left + 'px';
    tabbar.style.top = clamped.top + 'px';
    tabbar.style.bottom = 'auto';
  }

  function endDrag(): void {
    const tabbar = tabbarRef.value;
    if (isDragging.value) {
      isDragging.value = false;
      if (tabbar) tabbar.classList.remove('dragging');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  }

  onMounted(() => {
    const tabbar = tabbarRef.value;
    if (!tabbar) return;

    // Mouse events
    mouseMoveHandler = (e: MouseEvent) => moveDrag(e);
    mouseUpHandler = endDrag;
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);

    // Touch events
    touchMoveHandler = (e: TouchEvent) => {
      if (!isDragging.value) return;
      const touch = e.touches[0];
      moveDrag({
        clientX: touch.clientX,
        clientY: touch.clientY,
        preventDefault: () => e.preventDefault(),
      });
    };
    touchEndHandler = endDrag;
    touchCancelHandler = endDrag;
    document.addEventListener('touchmove', touchMoveHandler, { passive: false });
    document.addEventListener('touchend', touchEndHandler, { passive: true });
    document.addEventListener('touchcancel', touchCancelHandler, { passive: true });

    // Tabbar drag initiation
    tabbar.addEventListener('mousedown', (e) => startDrag(e));
    tabbar.addEventListener('touchstart', (e) => {
      if (isTabItemClick(e.target as HTMLElement)) return;

      const touch = e.touches[0];
      startDrag({
        clientX: touch.clientX,
        clientY: touch.clientY,
        preventDefault: () => e.preventDefault(),
      });
    }, { passive: false });

    // Window resize
    resizeHandler = () => {
      if (!isDragging.value) {
        const rect = tabbar.getBoundingClientRect();
        const clamped = clampPosition(rect.left, rect.top, tabbar);
        tabbar.style.left = clamped.left + 'px';
        tabbar.style.top = clamped.top + 'px';
      }
    };
    window.addEventListener('resize', resizeHandler);

    // Initialize position
    initDragPosition(tabbar);
  });

  onUnmounted(() => {
    if (mouseMoveHandler) document.removeEventListener('mousemove', mouseMoveHandler);
    if (mouseUpHandler) document.removeEventListener('mouseup', mouseUpHandler);
    if (touchMoveHandler) document.removeEventListener('touchmove', touchMoveHandler);
    if (touchEndHandler) document.removeEventListener('touchend', touchEndHandler);
    if (touchCancelHandler) document.removeEventListener('touchcancel', touchCancelHandler);
    if (resizeHandler) window.removeEventListener('resize', resizeHandler);
  });

  return {
    activeTab,
    pressedTab,
    isDragging,
  };
}
