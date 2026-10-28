// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';

import { DialogFocusController } from '../../../js/dialog/focus';

import type { DialogFocusable } from '../../../js/dialog/focus';

const createDialog = () => {
  const dialog = document.createElement('div');
  dialog.tabIndex = 0;
  const card = document.createElement('div');
  const cancel = document.createElement('button');
  cancel.className = 't-dialog__cancel';
  cancel.textContent = '取消';
  const confirm = document.createElement('button');
  confirm.className = 't-dialog__confirm';
  confirm.textContent = '确认';
  card.append(cancel, confirm);
  dialog.append(card);
  document.body.append(dialog);
  return { dialog, card, cancel, confirm };
};

afterEach(() => {
  document.body.innerHTML = '';
});

describe('DialogFocusController', () => {
  it('focuses the dialog, buttons, custom element, or nothing', () => {
    const { dialog, card, cancel, confirm } = createDialog();
    const input = document.createElement('input');
    document.body.append(input);
    let focusable: DialogFocusable = {};
    const controller = new DialogFocusController({
      classPrefix: 't',
      isTop: () => true,
      getDialogEl: () => dialog,
      getDialogCardEl: () => card,
      getFocusable: () => focusable,
    });

    controller.focus();
    expect(document.activeElement).toBe(dialog);

    focusable = { defaultFocus: 'confirm-button' };
    controller.focus();
    expect(document.activeElement).toBe(confirm);

    focusable = { defaultFocus: 'cancel-button' };
    controller.focus();
    expect(document.activeElement).toBe(cancel);

    focusable = { defaultFocus: () => input };
    controller.focus();
    expect(document.activeElement).toBe(input);

    dialog.focus();
    focusable = { defaultFocus: null };
    controller.focus();
    expect(document.activeElement).toBe(dialog);
  });

  it('records the trigger on open and restores it after close', () => {
    const { dialog, card } = createDialog();
    const trigger = document.createElement('button');
    document.body.append(trigger);
    trigger.focus();
    const controller = new DialogFocusController({
      classPrefix: 't',
      isTop: () => true,
      getDialogEl: () => dialog,
      getDialogCardEl: () => card,
      getFocusable: () => ({ focusTriggerAfterClose: true }),
    });

    controller.onVisibleChange(true);
    dialog.focus();
    controller.restore();
    expect(document.activeElement).toBe(trigger);

    trigger.focus();
    controller.onVisibleChange(false);
    controller.onVisibleChange(true);
    dialog.focus();
    controller.restore();
    expect(document.activeElement).toBe(trigger);
  });

  it('clears the trigger when focus restoration is disabled', () => {
    const { dialog, card } = createDialog();
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();
    let focusTriggerAfterClose = false;
    const controller = new DialogFocusController({
      classPrefix: 't',
      isTop: () => true,
      getDialogEl: () => dialog,
      getDialogCardEl: () => card,
      getFocusable: () => ({ focusTriggerAfterClose }),
    });

    controller.onVisibleChange(true);
    dialog.focus();
    controller.restore();
    focusTriggerAfterClose = true;
    controller.restore();

    expect(document.activeElement).toBe(dialog);
  });

  it('keeps Tab and outside focus inside the top dialog', () => {
    const { dialog, card, cancel, confirm } = createDialog();
    const outside = document.createElement('button');
    document.body.append(outside);
    let top = true;
    const controller = new DialogFocusController({
      classPrefix: 't',
      isTop: () => top,
      getDialogEl: () => dialog,
      getDialogCardEl: () => card,
      getFocusable: () => ({ focusTrap: true }),
    });
    const stop = controller.bindTrap();

    confirm.focus();
    const forward = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    document.dispatchEvent(forward);
    expect(forward.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(cancel);

    cancel.focus();
    const backward = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true });
    document.dispatchEvent(backward);
    expect(document.activeElement).toBe(confirm);

    outside.focus();
    expect(dialog.contains(document.activeElement)).toBe(true);

    top = false;
    outside.focus();
    expect(document.activeElement).toBe(outside);

    stop();
    confirm.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
    expect(document.activeElement).toBe(confirm);
  });
});
