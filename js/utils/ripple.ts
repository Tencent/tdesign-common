import setStyle from './setStyle';

export interface RippleOptions {
  /** 组件类名前缀 */
  classPrefix: string;
  /** 是否开启动画 */
  enable: boolean;
  /** 波纹颜色，优先于 data-ripple 和 --ripple-color */
  rippleColor?: string;
}

const period = 200;
const elementTransitionPeriod = 200;
const rippleExtraWidth = 20;
const rippleSkewDeg = 8;
const rippleSkew = `skewX(-${rippleSkewDeg}deg)`;
const noneRippleBg = 'rgba(0, 0, 0, 0)';
const defaultRippleColor = 'rgba(0, 0, 0, 0.35)';
const blockingStates = ['is-active', 'is-disabled', 'is-checked', 'is-loading'];

const getRippleSkewOffset = (height: number) => {
  if (!height) return 0;
  return Math.ceil((height / 2) * Math.tan((rippleSkewDeg * Math.PI) / 180));
};

const hasBlockingState = (el: Element, classPrefix: string) =>
  blockingStates.some((state) => el.classList.contains(`${classPrefix}-${state}`));

const getRippleColor = (el: HTMLElement, rippleColor?: string) => {
  if (rippleColor) {
    return rippleColor;
  }
  if (el?.dataset?.ripple) {
    return el.dataset.ripple;
  }
  if (el instanceof Element) {
    const cssVariable = getComputedStyle(el).getPropertyValue('--ripple-color');
    if (cssVariable) {
      return cssVariable;
    }
  }
  return defaultRippleColor;
};

/**
 * 在元素上启用斜八角按压动画，返回解除绑定的函数。
 */
export function bindRipple(el: HTMLElement, getOptions: () => RippleOptions): () => void {
  if (typeof document === 'undefined' || !el) {
    return () => undefined;
  }

  let container: HTMLDivElement | null = null;
  const sessions = new Set<() => void>();

  const ensureContainer = (classPrefix: string) => {
    if (!container) {
      container = document.createElement('div');
    }
    container.className = `${classPrefix}-ripple`;
    return container;
  };

  const handlePointerDown = (event: PointerEvent) => {
    if (event.button !== 0 || !(el instanceof Element)) return;

    const { classPrefix, enable, rippleColor } = getOptions();
    if (!enable || hasBlockingState(el, classPrefix)) return;

    const color = getRippleColor(el, rippleColor);
    const elStyle = getComputedStyle(el);
    const elBorder = parseInt(elStyle.borderWidth, 10);
    const border = elBorder > 0 ? elBorder : 0;
    const rippleContainer = ensureContainer(classPrefix);

    if (rippleContainer.parentNode === null) {
      setStyle(rippleContainer, {
        position: 'absolute',
        left: `${0 - border}px`,
        top: `${0 - border}px`,
        width: `calc(100% + ${border * 2}px)`,
        height: `calc(100% + ${border * 2}px)`,
        borderRadius: elStyle.borderRadius,
        pointerEvents: 'none',
        overflow: 'hidden',
      });
      el.appendChild(rippleContainer);
    }

    const ripple = document.createElement('div');
    ripple.className = `${classPrefix}-ripple__inner`;

    const skewOffset = getRippleSkewOffset(rippleContainer.offsetHeight || el.offsetHeight);
    const rippleWidth = rippleExtraWidth + skewOffset * 2;

    setStyle(ripple, {
      marginTop: '0',
      marginLeft: '0',
      right: '100%',
      // 使用百分比控制尺寸与位移，并通过斜切外扩补偿，确保波纹动画结束时铺满宿主元素
      width: `calc(100% + ${rippleWidth}px)`,
      height: '100%',
      transition: `transform ${period}ms cubic-bezier(.38, 0, .24, 1), background ${period * 2}ms linear`,
      transform: rippleSkew,
      pointerEvents: 'none',
      position: 'absolute',
      zIndex: '0',
      backgroundColor: color,
      opacity: '0.9',
    });

    Array.from(el.children).forEach((child) => {
      const element = child as HTMLElement;
      if (element.style.zIndex === '' && element !== rippleContainer) {
        element.style.zIndex = '1';
      }
    });

    const initPosition = el.style.position ? el.style.position : getComputedStyle(el).position;
    if (initPosition === '' || initPosition === 'static') {
      // eslint-disable-next-line no-param-reassign
      el.style.position = 'relative';
    }
    rippleContainer.insertBefore(ripple, rippleContainer.firstChild);

    setTimeout(() => {
      ripple.style.transform = `translateX(calc(100% - ${rippleExtraWidth + skewOffset}px)) ${rippleSkew}`;
    }, 0);

    let cleared = false;
    let classChangeObserver: MutationObserver | null = null;
    const handleClearRipple = () => {
      if (cleared) return;
      cleared = true;
      sessions.delete(handleClearRipple);

      ripple.style.backgroundColor = noneRippleBg;

      if (classChangeObserver) {
        classChangeObserver.disconnect();
        classChangeObserver = null;
      }

      el.removeEventListener('pointerup', handleClearRipple, false);
      el.removeEventListener('pointerleave', handleClearRipple, false);

      setTimeout(
        () => {
          ripple.remove();
          if (rippleContainer.children.length === 0) rippleContainer.remove();
        },
        period * 2 + 100
      );
    };

    sessions.add(handleClearRipple);

    if (typeof MutationObserver !== 'undefined') {
      classChangeObserver = new MutationObserver(() => {
        if (!(el instanceof Element) || !hasBlockingState(el, classPrefix)) return;
        ripple.style.transition = `transform ${period}ms cubic-bezier(.38, 0, .24, 1), background ${elementTransitionPeriod}ms linear`;
        handleClearRipple();
      });
      classChangeObserver.observe(el, {
        attributes: true,
        attributeFilter: ['class'],
      });
    }

    el.addEventListener('pointerup', handleClearRipple, false);
    el.addEventListener('pointerleave', handleClearRipple, false);
  };

  el.addEventListener('pointerdown', handlePointerDown, false);

  return () => {
    el.removeEventListener('pointerdown', handlePointerDown, false);
    sessions.forEach((release) => release());
  };
}
