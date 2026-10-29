import { describe, expect, it } from 'vitest';
import TreeStore from '../../../js/tree-v1/tree-store';

describe('tree-v1 bigint values', () => {
  it('looks up bigint values without conflating them with numbers or strings', () => {
    const tree = new TreeStore({});
    tree.append([{ value: 1n }, { value: 1 }, { value: '1' }]);
    expect(tree.getNode(1n).value).toBe(1n);
    expect(tree.getNode(1).value).toBe(1);
    expect(tree.getNode('1').value).toBe('1');
    expect(tree.getNode(2n)).toBeNull();
  });

  it.each([0, 0n])('gets the subtree for zero value %s instead of all nodes', (value) => {
    const tree = new TreeStore({});
    tree.append([{ value: 'other' }, { value, children: [{ value: 'child' }] }]);
    tree.refreshNodes();
    expect(tree.getNodes(value).map((node) => node.value)).toEqual([value, 'child']);
    expect(tree.getNodes().map((node) => node.value)).toEqual(['other', value, 'child']);
  });

  it('appends and removes nodes using bigint values including zero', () => {
    const tree = new TreeStore({});
    tree.append([{ value: 2n, children: [{ value: 0n }] }]);
    tree.appendNodes(2n, { value: 3n });
    expect(tree.getNode(3n).getParent().value).toBe(2n);
    tree.getNode(2n).getModel().remove(0n);
    expect(tree.getNode(0n)).toBeNull();
    expect(tree.getNode(2n)).not.toBeNull();
  });

  it('removes only the empty-string child', () => {
    const tree = new TreeStore({});
    tree.append([{ value: 'parent', children: [{ value: '' }, { value: 'sibling' }] }]);
    tree.refreshNodes();
    tree.getNode('parent').getModel().remove('');
    expect(tree.getNode('')).toBeNull();
    expect(tree.getNode('parent')).toBeTruthy();
    expect(tree.getNode('sibling')).toBeTruthy();
  });

  it('limits getNodes to the empty-string subtree', () => {
    const tree = new TreeStore({});
    tree.append([{ value: '', children: [{ value: 'child' }] }, { value: 'other' }]);
    tree.refreshNodes();
    expect(tree.getNodes('').map((node) => node.value)).toEqual(['', 'child']);
  });

  it('keeps bigint, number and string path keys distinct when duplicate values are allowed', () => {
    const tree = new TreeStore({ allowDuplicateValue: true });
    tree.append([
      { value: 1n, children: [{ value: 'a' }] },
      { value: 1, children: [{ value: 'b' }] },
      { value: '1', children: [{ value: 'c' }] },
    ]);
    expect(tree.getNode([1n]).value).toBe(1n);
    expect(tree.getNode([1]).value).toBe(1);
    expect(tree.getNode(['1']).value).toBe('1');
  });
});
