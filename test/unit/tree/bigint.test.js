import { describe, expect, it } from 'vitest';
import { TreeStore } from '../../../js/tree/tree-store';

describe('Tree bigint node operations', () => {
  // Issue: https://github.com/Tencent/tdesign-vue-next/issues/6798
  it('keeps zero bigint activation, checking and expansion independent from numeric zero', () => {
    const store = new TreeStore({ activable: true, checkable: true, checkStrictly: true });
    store.append([{ value: 0n, children: [{ value: 2n }] }, { value: 0 }]);
    store.refreshNodes();
    store.replaceActived([0n]);
    store.replaceChecked([0n]);
    store.replaceExpanded([0n]);
    expect(store.getNode(0n).actived).toBe(true);
    expect(store.getNode(0n).checked).toBe(true);
    expect(store.getNode(0n).expanded).toBe(true);
    expect(store.getNode(0).actived).toBe(false);
    expect(store.getNode(0).checked).toBe(false);
    expect(store.getNode(0).expanded).toBe(false);
  });

  // Issue: https://github.com/Tencent/tdesign-vue-next/issues/6798
  it('inserts around a zero bigint target and removes the requested node', () => {
    const store = new TreeStore({});
    store.append([{ value: 0n }]);
    store.insertBefore(0n, { value: 1n });
    store.insertAfter(0n, { value: 2n });
    store.refreshNodes();
    expect(store.getNodes().map((node) => node.value)).toEqual([1n, 0n, 2n]);
    store.remove(0n);
    store.refreshNodes();
    expect(store.getNode(0n)).toBeNull();
    expect(store.getNodes().map((node) => node.value)).toEqual([1n, 2n]);
  });

  // Issue: https://github.com/Tencent/tdesign-vue-next/issues/6798
  it.each([0n, 0, ''])('removes only the requested child with value %s', (value) => {
    const store = new TreeStore({});
    store.append([{ value: 'parent', children: [{ value }, { value: 'sibling' }] }]);
    store.refreshNodes();
    store.getNode('parent').getModel().remove(value);
    expect(store.getNode(value)).toBeNull();
    expect(store.getNode('parent')).toBeTruthy();
    expect(store.getNode('sibling')).toBeTruthy();
  });

  // Issue: https://github.com/Tencent/tdesign-vue-next/issues/6798
  it('still removes the model itself when the target is omitted', () => {
    const store = new TreeStore({});
    store.append([{ value: 0n }, { value: 1n }]);
    store.refreshNodes();
    store.getNode(0n).getModel().remove();
    expect(store.getNode(0n)).toBeNull();
    expect(store.getNode(1n)).toBeTruthy();
  });

  // Issue: https://github.com/Tencent/tdesign-vue-next/issues/6798
  it('limits getNodes(0n) to that subtree and appends to the zero node', () => {
    const store = new TreeStore({});
    store.append([{ value: 0n, children: [{ value: 2n }] }, { value: 1n }]);
    store.refreshNodes();
    expect(store.getNodes(0n).map((node) => node.value)).toEqual([0n, 2n]);
    store.appendNodes(0n, { value: 3n });
    store.refreshNodes();
    expect(store.getNode(3n).getParent().value).toBe(0n);
    expect(store.getNodes().map((node) => node.value)).toEqual([0n, 2n, 3n, 1n]);
  });

  // Issue: https://github.com/Tencent/tdesign-vue-next/issues/6798
  it.each([Object(0), Object('boxed')])('preserves boxed string/number lookup for %s', (value) => {
    const store = new TreeStore({});
    store.append([{ value }, { value: 'sibling' }]);
    store.refreshNodes();
    expect(store.getNode(value)?.value).toBe(value);
    expect(store.getNode(value.valueOf())).toBeNull();
  });

  it.each([Object(0), Object('boxed')])('limits boxed string/number subtree lookup for %s', (value) => {
    const store = new TreeStore({});
    store.append([{ value, children: [{ value: 'child' }] }, { value: 'sibling' }]);
    store.refreshNodes();
    expect(store.getNodes(value).map((node) => node.value)).toEqual([value, 'child']);
  });

  it.each([Object(0), Object('boxed')])('appends to a boxed string/number target for %s', (value) => {
    const store = new TreeStore({});
    store.append([{ value }, { value: 'sibling' }]);
    store.refreshNodes();
    store.appendNodes(value, { value: 'child' });
    store.refreshNodes();
    expect(store.getNode('child')?.getParent()?.value).toBe(value);
    expect(store.getNode('sibling')).toBeTruthy();
  });

  // Issue: https://github.com/Tencent/tdesign-vue-next/issues/6798
  it('keeps string, number and bigint identities distinct without losing large integer precision', () => {
    const values = [1, '1', 1n, 9007199254740992n, 9007199254740993n];
    const store = new TreeStore({ activable: true });
    store.append(values.map((value) => ({ value })));
    store.refreshNodes();
    values.forEach((value) => expect(store.getNode(value).value).toBe(value));
    store.replaceActived([1n]);
    expect(store.getNode(1n).actived).toBe(true);
    expect(store.getNode(1).actived).toBe(false);
    expect(store.getNode('1').actived).toBe(false);
  });
});
