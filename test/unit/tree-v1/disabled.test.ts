import { describe, expect, it } from 'vitest';
import TreeStore from '../../../js/tree-v1/tree-store';

describe('tree-v1 disabled children checking', () => {
  const data = [
    {
      value: 'parent',
      children: [{ value: 'enabled' }, { value: 'disabled', disabled: true }],
    },
  ];

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
});
