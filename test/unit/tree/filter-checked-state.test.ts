import { describe, expect, it } from 'vitest';
import TreeStore from '../../../js/tree/tree-store';

// 筛选后，父节点的全选/半选状态只应统计仍然可见的子节点（issue #3078）
const data = [{ value: 'P', children: [{ value: 'A' }, { value: 'B' }, { value: 'C' }] }];

describe('tree filtered check state', () => {
  it('marks the parent as fully checked when all visible children are checked', () => {
    const tree = new TreeStore({ checkable: true, filter: (node: any) => node.value !== 'C' });
    tree.append(data);
    const parent = tree.getNode('P');
    tree.setChecked(['A', 'B']);
    expect(parent.checked).toBe(true);
    expect(parent.indeterminate).toBe(false);
  });

  it('does not mark the parent as fully checked while a visible child is unchecked', () => {
    const tree = new TreeStore({ checkable: true, filter: (node: any) => node.value !== 'C' });
    tree.append(data);
    const parent = tree.getNode('P');
    tree.setChecked(['A']);
    expect(parent.checked).toBe(false);
    expect(parent.indeterminate).toBe(true);
  });

  it('keeps the unfiltered behaviour when no filter is set', () => {
    const tree = new TreeStore({ checkable: true });
    tree.append(data);
    const parent = tree.getNode('P');
    tree.setChecked(['A', 'B']);
    expect(parent.checked).toBe(false);
    expect(parent.indeterminate).toBe(true);
  });
});
