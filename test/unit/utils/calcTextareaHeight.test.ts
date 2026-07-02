// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';

import calcTextareaHeight from '../../../js/utils/calcTextareaHeight';

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('calcTextareaHeight', () => {
  it('removes hidden textarea after height calculation', () => {
    const textarea = document.createElement('textarea');
    textarea.value = 'textarea content';
    document.body.appendChild(textarea);

    const result = calcTextareaHeight(textarea);

    expect(result.height).toBeDefined();
    expect(document.body.querySelectorAll('textarea')).toHaveLength(1);
  });

  it('removes hidden textarea after reentrant height calculations', () => {
    const firstTextarea = document.createElement('textarea');
    firstTextarea.value = 'first textarea content';
    document.body.appendChild(firstTextarea);

    const secondTextarea = document.createElement('textarea');
    secondTextarea.value = 'second textarea content';
    document.body.appendChild(secondTextarea);

    let isReentered = false;
    vi.spyOn(HTMLTextAreaElement.prototype, 'scrollHeight', 'get').mockImplementation(function mockScrollHeight(
      this: HTMLTextAreaElement
    ) {
      if (!isReentered && !this.isConnected) return 0;
      if (!isReentered && this !== firstTextarea && this !== secondTextarea) {
        isReentered = true;
        calcTextareaHeight(secondTextarea);
      }
      return 20;
    });

    const result = calcTextareaHeight(firstTextarea);

    expect(result.height).toBeDefined();
    expect(document.body.querySelectorAll('textarea')).toHaveLength(2);
  });
});
