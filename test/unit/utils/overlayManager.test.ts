// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';

import { OverlayManager } from '../../../js/utils/overlayManager';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('OverlayManager', () => {
  it('uses registration order to identify the top overlay', () => {
    const manager = new OverlayManager();
    const dialog = manager.register({ type: 'dialog' });
    const drawer = manager.register({ type: 'drawer' });

    expect(manager.isTop(dialog)).toBe(false);
    expect(manager.isTop(drawer)).toBe(true);
    expect(manager.getTop()).toBe(drawer);
  });

  it('focuses the previous overlay after removing the top one', () => {
    const manager = new OverlayManager();
    const dialogElement = document.createElement('div');
    const drawerElement = document.createElement('div');
    dialogElement.tabIndex = -1;
    drawerElement.tabIndex = -1;
    document.body.append(dialogElement, drawerElement);

    const dialog = manager.register({ type: 'dialog', getElement: () => dialogElement });
    const drawer = manager.register({ type: 'drawer', getElement: () => drawerElement });
    drawerElement.focus();
    manager.unregister(drawer);

    expect(document.activeElement).toBe(dialogElement);
    expect(manager.isTop(dialog)).toBe(true);
  });

  it('does not move focus when removing an overlay below the top one', () => {
    const manager = new OverlayManager();
    const dialogElement = document.createElement('div');
    const drawerElement = document.createElement('div');
    dialogElement.tabIndex = -1;
    drawerElement.tabIndex = -1;
    document.body.append(dialogElement, drawerElement);

    const dialog = manager.register({ type: 'dialog', getElement: () => dialogElement });
    manager.register({ type: 'drawer', getElement: () => drawerElement });
    drawerElement.focus();
    manager.unregister(dialog);

    expect(document.activeElement).toBe(drawerElement);
  });

  it('ignores an unregistered overlay', () => {
    const manager = new OverlayManager();
    const dialog = manager.register({ type: 'dialog' });

    manager.unregister({ type: 'drawer' });

    expect(manager.getTop()).toBe(dialog);
  });
});
