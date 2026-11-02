import { describe, expect, it } from 'vitest';
import TreeStore from '../../../js/tree-v1/tree-store';
import type { TypeTreeStoreOptions } from '../../../js/tree-v1/types';

const data = [{ value: 'P', children: [{ value: 'A' }, { value: 'B' }, { value: 'D', disabled: true }] }];

function createStore(options: TypeTreeStoreOptions = {}) {
  const store = new TreeStore({ checkable: true, valueMode: 'parentFirst', ...options });
  store.append(data);
  store.refreshNodes();
  return store;
}

describe('tree-v1 checkAllAffectedBy', () => {
  it('defaults to onlyEnabled to preserve the current parent state behavior', () => {
    const store = createStore();
    expect(store.config.checkAllAffectedBy).toBe('onlyEnabled');
    store.setChecked(['A', 'B']);
    expect(store.getNode('P').isChecked()).toBe(true);
    expect(store.getNode('D').isChecked()).toBe(false);
    expect(store.getChecked()).toEqual(['P']);
  });

  (['all', 'onlyEnabled'] as const).forEach((scope) => {
    it.each(['all', 'parentFirst', 'onlyLeaf'] as const)(
      `${scope} preserves disabled state during a controlled %s round trip`,
      (valueMode) => {
        const store = createStore({ checkAllAffectedBy: scope, valueMode });
        const parent = store.getNode('P');
        const values = parent.toggleChecked();
        const expected =
          scope === 'onlyEnabled'
            ? { all: ['P', 'A', 'B'], parentFirst: ['P'], onlyLeaf: ['A', 'B'] }[valueMode]
            : ['A', 'B'];
        expect(values).toEqual(expected);
        store.replaceChecked(values);
        expect(parent.isChecked()).toBe(scope === 'onlyEnabled');
        expect(parent.isIndeterminate()).toBe(scope === 'all');
        expect(store.getNode('D').isChecked()).toBe(false);
        const cleared = parent.toggleChecked();
        expect(cleared).toEqual([]);
        store.replaceChecked(cleared);
        expect(parent.isChecked()).toBe(false);
        expect(parent.isIndeterminate()).toBe(false);
      }
    );

    it(`${scope} does not affect strict selection`, () => {
      const store = createStore({ checkAllAffectedBy: scope, checkStrictly: true });
      store.setChecked(['A', 'B']);
      expect(store.getNode('P').isChecked()).toBe(false);
      expect(store.getNode('P').isIndeterminate()).toBe(false);
      expect(store.getNode('P').toggleChecked()).toEqual(['P', 'A', 'B']);
    });
  });

  it('recalculates loaded parents on strategy changes without selecting disabled children', () => {
    const store = createStore({ checkAllAffectedBy: 'onlyEnabled' });
    store.setChecked(['A', 'B']);
    const parent = store.getNode('P');
    store.refreshState();
    expect(parent.checked).toBe(true);
    store.setConfig({ checkAllAffectedBy: 'all' });
    expect(parent.checked).toBe(false);
    expect(parent.indeterminate).toBe(true);
    expect(store.getNode('D').isChecked()).toBe(false);
    expect(store.getChecked()).toEqual(['A', 'B']);
    store.setConfig({ checkAllAffectedBy: 'onlyEnabled' });
    expect(parent.checked).toBe(true);
    expect(parent.indeterminate).toBe(false);
    expect(store.getNode('D').isChecked()).toBe(false);
  });

  it('onlyEnabled retains explicitly selected disabled values when parentFirst collapses enabled children', () => {
    const store = createStore({ checkAllAffectedBy: 'onlyEnabled' });
    store.setChecked(['D']);
    const parent = store.getNode('P');
    const selected = parent.toggleChecked();
    expect(selected).toEqual(['P', 'D']);
    store.replaceChecked(selected);
    expect(store.getNode('D').isChecked()).toBe(true);
    const cleared = parent.toggleChecked();
    expect(cleared).toEqual(['D']);
    store.replaceChecked(cleared);
    expect(store.getNode('D').isChecked()).toBe(true);
  });

  it('does not derive a state in onlyEnabled when every child is disabled', () => {
    const store = new TreeStore({ checkable: true, checkAllAffectedBy: 'onlyEnabled' });
    store.append([{ value: 'P', children: [{ value: 'D', disabled: true }] }]);
    store.refreshNodes();
    store.setChecked(['D']);
    expect(store.getNode('P').isChecked()).toBe(false);
    expect(store.getNode('P').isIndeterminate()).toBe(false);
    expect(store.getNode('D').isChecked()).toBe(true);
    store.setConfig({ checkAllAffectedBy: 'all' });
    expect(store.getNode('P').isChecked()).toBe(true);
    expect(store.getNode('D').isChecked()).toBe(true);
  });
});
