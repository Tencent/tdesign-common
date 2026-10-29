import { describe, expect, it, vi } from 'vitest';
import TreeStore from '../../../js/tree/tree-store';

describe('tree disabled children checking', () => {
  const data = [
    {
      value: 'parent',
      children: [{ value: 'enabled' }, { value: 'disabled', disabled: true }],
    },
  ];

  it.each(['all', 'parentFirst'] as const)(
    'keeps disabled children unchanged when loading a checked parent in %s mode',
    async (valueMode) => {
      const tree = new TreeStore({
        checkable: true,
        valueMode,
        lazy: true,
        load: async () => [
          { value: 'enabled' },
          { value: 'disabled', disabled: true },
          { value: 'explicit', disabled: true, checked: true },
        ],
      });
      tree.append([{ value: 'parent', children: true }]);
      tree.setChecked(['parent']);
      expect(tree.getNode('parent').checked).toBe(true);
      tree.setExpanded(['parent']);
      await vi.waitFor(() => expect(tree.getNode('disabled')).toBeTruthy());
      expect(tree.getNode('enabled').checked).toBe(true);
      expect(tree.getNode('disabled').checked).toBe(false);
      expect(tree.getNode('explicit').checked).toBe(true);
      expect(tree.getNode('parent').checked).toBe(true);
    }
  );

  it.each(['onlyLeaf', 'all', 'parentFirst'] as const)(
    'ignores disabled children when deriving parent state in %s mode',
    (valueMode) => {
      const tree = new TreeStore({ checkable: true, valueMode });
      tree.append(data);
      const parent = tree.getNode('parent');
      tree.setChecked(['enabled']);
      expect(parent.isChecked()).toBe(true);
      expect(parent.isIndeterminate()).toBe(false);
      expect(tree.getNode('disabled').isChecked()).toBe(false);
      tree.replaceChecked(parent.toggleChecked());
      expect(parent.isChecked()).toBe(false);
      expect(parent.isIndeterminate()).toBe(false);
    }
  );

  it.each(['onlyLeaf', 'all', 'parentFirst'] as const)(
    'does not select disabled descendants from an explicit parent value in %s mode',
    (valueMode) => {
      const tree = new TreeStore({ checkable: true, valueMode });
      tree.append(data);
      tree.setChecked(['parent']);
      expect(tree.getNode('parent').isChecked()).toBe(true);
      expect(tree.getNode('enabled').isChecked()).toBe(true);
      expect(tree.getNode('disabled').isChecked()).toBe(false);
      tree.replaceChecked(['disabled']);
      expect(tree.getNode('disabled').isChecked()).toBe(true);
      expect(tree.getNode('parent').isChecked()).toBe(false);
      expect(tree.getNode('parent').isIndeterminate()).toBe(false);
    }
  );

  it('retains explicitly selected disabled nodes when serializing parentFirst values', () => {
    const tree = new TreeStore({ checkable: true, valueMode: 'parentFirst' });
    tree.append(data);
    tree.setChecked(['enabled', 'disabled']);
    expect(tree.getChecked()).toEqual(['parent', 'disabled']);
    tree.replaceChecked(tree.getChecked());
    expect(tree.getNode('disabled').isChecked()).toBe(true);
  });

  it('does not select parents automatically when every child is disabled', () => {
    const tree = new TreeStore({ checkable: true, valueMode: 'all' });
    tree.append([{ value: 'parent', children: [{ value: 'disabled', disabled: true }] }]);
    expect(tree.getChecked()).toEqual([]);
    expect(tree.getNode('parent').toggleChecked()).toEqual([]);
  });

  it.each(['onlyLeaf', 'all', 'parentFirst'] as const)(
    'round-trips Vue Next UI selection and cancellation in %s mode',
    (valueMode) => {
      const tree = new TreeStore({ checkable: true, valueMode });
      tree.append([{ value: 'parent', children: [{ value: 'a' }, { value: 'b' }, { value: 'd', disabled: true }] }]);
      const parent = tree.getNode('parent');
      const selected = parent.setChecked(true, { isAction: true, directly: true });
      const expected = { all: ['parent', 'a', 'b'], parentFirst: ['parent'], onlyLeaf: ['a', 'b'] };
      expect(selected).toEqual(expected[valueMode]);
      tree.replaceChecked(selected);
      expect(parent.getModel().checked).toBe(true);
      expect(parent.getModel().indeterminate).toBe(false);
      expect(tree.getNode('d').checked).toBe(false);
      tree.replaceChecked(parent.setChecked(false, { isAction: true, directly: true }));
      expect(tree.getChecked()).toEqual([]);
      expect(parent.checked).toBe(false);
      expect(parent.indeterminate).toBe(false);
      tree.getNode('a').setChecked(true, { directly: true });
      expect(parent.indeterminate).toBe(true);
      tree.getNode('b').setChecked(true, { directly: true });
      expect(parent.checked).toBe(true);
      expect(parent.indeterminate).toBe(false);
    }
  );

  it('updates cached parent state when a child is disabled and re-enabled', () => {
    const tree = new TreeStore({ checkable: true });
    tree.append(data);
    const parent = tree.getNode('parent');
    const disabled = tree.getNode('disabled');
    tree.setChecked(['enabled']);
    expect(parent.checked).toBe(true);
    disabled.setDisabled(false);
    expect(parent.checked).toBe(false);
    expect(parent.indeterminate).toBe(true);
    disabled.setDisabled(true);
    expect(parent.checked).toBe(true);
    expect(parent.indeterminate).toBe(false);
  });

  it('does not cascade strict checking to enabled or disabled children', () => {
    const tree = new TreeStore({ checkable: true, checkStrictly: true });
    tree.append(data);
    expect(tree.getNode('parent').setChecked(true, { directly: true })).toEqual(['parent']);
    expect(tree.getNode('enabled').checked).toBe(false);
    expect(tree.getNode('disabled').checked).toBe(false);
  });
});
