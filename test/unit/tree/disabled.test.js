import { describe, it, expect } from 'vitest';
import TreeStore from '../../../js/tree/tree-store';

// 禁用状态
// 原则:
// 1. 显式值操作可选中禁用节点，父节点值不自动选中禁用后代
// 2. treeNode 上的 setChecked 方法，受禁用影响
// 3. 禁用子节点不参与父节点全选和半选判断；没有可用子节点时不自动全选
describe('tree:disabled', () => {
  describe('值操作', () => {
    it('整个树为禁用状态，值操作可以选中节点', async () => {
      const tree = new TreeStore({
        checkable: true,
        disabled: true,
      });
      tree.append([
        {
          value: 't1',
          children: [
            {
              value: 't1.1',
            },
          ],
        },
      ]);

      tree.setChecked(['t1.1']);
      expect(tree.getChecked().length).toBe(1);
      const t1 = tree.getNode('t1');
      const t1d1 = tree.getNode('t1.1');
      expect(t1.checked).toBe(false);
      expect(t1d1.checked).toBe(true);
    });
  });

  it('整个树为禁用状态, 节点直接设值可以切换选中态', async () => {
    const tree = new TreeStore({
      checkable: true,
      disabled: true,
    });
    tree.append([
      {
        value: 't1',
        children: [
          {
            value: 't1.1',
          },
        ],
      },
    ]);

    const t1 = tree.getNode('t1');
    const t1d1 = tree.getNode('t1.1');

    tree.getNode('t1.1').setChecked(true, {
      isAction: false,
      directly: true,
    });
    expect(t1.checked).toBe(false);
    expect(t1d1.checked).toBe(true);
  });

  describe('重设选中态', () => {
    it('整个树为禁用状态，重设选中态不受影响', async () => {
      const tree = new TreeStore({
        checkable: true,
        disabled: true,
      });
      tree.append([
        {
          value: 't1',
          children: [
            {
              value: 't1.1',
              checked: true,
            },
            {
              value: 't1.2',
              checked: true,
            },
          ],
        },
        {
          value: 't2',
          children: [
            {
              value: 't2.1',
            },
            {
              value: 't2.2',
            },
          ],
        },
      ]);

      expect(tree.getNode('t1').checked).toBe(false);
      expect(tree.getNode('t2').checked).toBe(false);

      tree.replaceChecked(['t2.1', 't2.2']);
      expect(tree.getNode('t1').checked).toBe(false);
      expect(tree.getNode('t2').checked).toBe(false);
      const checked = tree.getChecked();
      expect(checked.length).toBe(2);
      expect(checked[0]).toBe('t2.1');
      expect(checked[1]).toBe('t2.2');
    });
  });

  describe('初始化', () => {
    it('整个树为禁用状态，初始化选中态不受影响', async () => {
      const tree = new TreeStore({
        checkable: true,
        disabled: true,
      });
      tree.append([
        {
          value: 't1',
          children: [
            {
              value: 't1.1',
              checked: true,
            },
            {
              value: 't1.2',
              checked: true,
            },
          ],
        },
        {
          value: 't2',
          children: [
            {
              value: 't2.1',
            },
            {
              value: 't2.2',
            },
          ],
        },
      ]);

      const checked = tree.getChecked();
      expect(checked.length).toBe(2);
      expect(checked[0]).toBe('t1.1');
      expect(checked[1]).toBe('t1.2');
      expect(tree.getNode('t1').isChecked()).toBe(false);
      expect(tree.getNode('t1').checked).toBe(false);
    });
  });

  describe('禁用状态的关联', () => {
    it('子节点禁用，父节点不受影响', async () => {
      const tree = new TreeStore({
        checkable: true,
      });
      tree.append([
        {
          value: 't1',
          children: [
            {
              value: 't1.1',
            },
            {
              value: 't1.2',
              disabled: true,
            },
          ],
        },
      ]);

      const t1 = tree.getNode('t1');
      const t1d1 = tree.getNode('t1.1');
      const t1d2 = tree.getNode('t1.2');

      expect(t1.isDisabled()).toBe(false);
      expect(t1d1.isDisabled()).toBe(false);
      expect(t1d2.isDisabled()).toBe(true);
    });

    it('父节点禁用，子节点也会被禁用', async () => {
      const tree = new TreeStore({
        checkable: true,
      });
      tree.append([
        {
          value: 't1',
          disabled: true,
          children: [
            {
              value: 't1.1',
            },
            {
              value: 't1.2',
            },
          ],
        },
      ]);

      const t1 = tree.getNode('t1');
      const t1d1 = tree.getNode('t1.1');
      const t1d2 = tree.getNode('t1.2');

      expect(t1.isDisabled()).toBe(true);
      expect(t1d1.isDisabled()).toBe(true);
      expect(t1d2.isDisabled()).toBe(true);
    });

    it('checkStrictly 为 true, 父节点禁用，子节点不会被禁用', async () => {
      const tree = new TreeStore({
        checkable: true,
        checkStrictly: true,
      });
      tree.append([
        {
          value: 't1',
          disabled: true,
          children: [
            {
              value: 't1.1',
            },
            {
              value: 't1.2',
            },
          ],
        },
      ]);

      const t1 = tree.getNode('t1');
      const t1d1 = tree.getNode('t1.1');
      const t1d2 = tree.getNode('t1.2');

      expect(t1.isDisabled()).toBe(true);
      expect(t1d1.isDisabled()).toBe(false);
      expect(t1d2.isDisabled()).toBe(false);
    });
  });

  describe('UI 操作', () => {
    it('整个树为禁用状态, UI check 无法切换选中态', async () => {
      const tree = new TreeStore({
        checkable: true,
        disabled: true,
      });
      tree.append([
        {
          value: 't1',
          children: [
            {
              value: 't1.1',
            },
          ],
        },
      ]);

      const t1 = tree.getNode('t1');
      const t1d1 = tree.getNode('t1.1');

      tree.getNode('t1.1').setChecked(true, {
        directly: true,
      });
      expect(t1.checked).toBe(false);
      expect(t1d1.checked).toBe(false);
    });

    it('UI check 向下扩散被 disabled 阻塞', async () => {
      const tree = new TreeStore({
        checkable: true,
      });
      tree.append([
        {
          value: 't1',
          children: [
            {
              value: 't1.1',
              disabled: true,
            },
            {
              value: 't1.2',
              disabled: true,
            },
          ],
        },
      ]);

      const t1 = tree.getNode('t1');
      const t1d1 = tree.getNode('t1.1');
      const t1d2 = tree.getNode('t1.2');

      tree.getNode('t1').setChecked(true, {
        directly: true,
      });
      expect(t1.checked).toBe(false);
      expect(t1d1.checked).toBe(false);
      expect(t1d2.checked).toBe(false);
    });

    it('UI check 跳过禁用子节点，可用子节点全选后父节点全选', async () => {
      const tree = new TreeStore({
        checkable: true,
      });
      tree.append([
        {
          value: 't1',
          children: [
            {
              value: 't1.1',
              disabled: true,
            },
            {
              value: 't1.2',
            },
          ],
        },
      ]);

      const t1 = tree.getNode('t1');
      const t1d1 = tree.getNode('t1.1');
      const t1d2 = tree.getNode('t1.2');

      tree.getNode('t1').setChecked(true, {
        directly: true,
      });
      expect(t1.checked).toBe(true);
      expect(t1.indeterminate).toBe(false);
      expect(t1d1.checked).toBe(false);
      expect(t1d2.checked).toBe(true);
    });

    it('禁用子节点未选中时，父节点可从半选切换到全选再取消', async () => {
      const tree = new TreeStore({
        checkable: true,
      });
      tree.append([
        {
          value: 't1',
          children: [
            {
              value: 't1.1',
              disabled: true,
            },
            {
              value: 't1.2',
            },
            {
              value: 't1.3',
            },
          ],
        },
      ]);

      const t1 = tree.getNode('t1');
      const t1d1 = tree.getNode('t1.1');
      const t1d2 = tree.getNode('t1.2');
      const t1d3 = tree.getNode('t1.3');

      expect(t1.isDisabled()).toBe(false);
      expect(t1d1.isDisabled()).toBe(true);

      t1d2.setChecked(true, {
        directly: true,
      });
      expect(t1.checked).toBe(false);
      expect(t1.indeterminate).toBe(true);
      expect(t1d1.checked).toBe(false);
      expect(t1d2.checked).toBe(true);
      expect(t1d3.checked).toBe(false);

      t1.toggleChecked({
        directly: true,
      });
      expect(t1.checked).toBe(true);
      expect(t1.indeterminate).toBe(false);
      expect(t1d1.checked).toBe(false);
      expect(t1d2.checked).toBe(true);
      expect(t1d3.checked).toBe(true);

      t1.toggleChecked({
        directly: true,
      });
      expect(t1.checked).toBe(false);
      expect(t1.indeterminate).toBe(false);
      expect(t1d1.checked).toBe(false);
      expect(t1d2.checked).toBe(false);
      expect(t1d3.checked).toBe(false);
    });

    it('已选禁用子节点不参与父节点的全选和半选判断', async () => {
      const tree = new TreeStore({
        checkable: true,
      });
      tree.append([
        {
          value: 't1',
          children: [
            {
              value: 't1.1',
            },
            {
              value: 't1.2',
            },
            {
              value: 't1.3',
            },
          ],
        },
      ]);

      const t1 = tree.getNode('t1');
      const t1d1 = tree.getNode('t1.1');
      const t1d2 = tree.getNode('t1.2');
      const t1d3 = tree.getNode('t1.3');

      t1d1.setChecked(true, {
        directly: true,
      });
      t1d1.setDisabled(true);
      expect(t1.isDisabled()).toBe(false);
      expect(t1d1.isDisabled()).toBe(true);
      expect(t1d1.checked).toBe(true);
      expect(t1.checked).toBe(false);
      expect(t1.indeterminate).toBe(false);

      t1d2.setChecked(true, {
        directly: true,
      });
      expect(t1.checked).toBe(false);
      expect(t1.indeterminate).toBe(true);
      expect(t1d1.checked).toBe(true);
      expect(t1d2.checked).toBe(true);
      expect(t1d3.checked).toBe(false);

      t1.toggleChecked({
        directly: true,
      });
      expect(t1.checked).toBe(true);
      expect(t1.indeterminate).toBe(false);
      expect(t1d1.checked).toBe(true);
      expect(t1d2.checked).toBe(true);
      expect(t1d3.checked).toBe(true);

      t1.toggleChecked({
        directly: true,
      });
      expect(t1.checked).toBe(false);
      expect(t1.indeterminate).toBe(false);
      expect(t1d1.checked).toBe(true);
      expect(t1d2.checked).toBe(false);
      expect(t1d3.checked).toBe(false);
    });

    it('禁用子节点状态不一致时，父节点仅切换可用子节点', async () => {
      const tree = new TreeStore({
        checkable: true,
      });
      tree.append([
        {
          value: 't1',
          children: [
            {
              value: 't1.1',
            },
            {
              value: 't1.2',
            },
            {
              value: 't1.3',
            },
            {
              value: 't1.4',
            },
          ],
        },
      ]);

      const t1 = tree.getNode('t1');
      const t1d1 = tree.getNode('t1.1');
      const t1d2 = tree.getNode('t1.2');
      const t1d3 = tree.getNode('t1.3');
      const t1d4 = tree.getNode('t1.4');

      t1d1.setChecked(true, {
        directly: true,
      });
      t1d1.setDisabled(true);
      t1d2.setDisabled(true);
      expect(t1.isDisabled()).toBe(false);
      expect(t1.checked).toBe(false);
      expect(t1.indeterminate).toBe(false);
      expect(t1d1.isDisabled()).toBe(true);
      expect(t1d1.checked).toBe(true);
      expect(t1d2.isDisabled()).toBe(true);
      expect(t1d2.checked).toBe(false);

      t1d3.setChecked(true, {
        directly: true,
      });
      expect(t1.checked).toBe(false);
      expect(t1.indeterminate).toBe(true);
      expect(t1d1.checked).toBe(true);
      expect(t1d2.checked).toBe(false);
      expect(t1d3.checked).toBe(true);
      expect(t1d4.checked).toBe(false);

      t1.toggleChecked({
        directly: true,
      });
      expect(t1.checked).toBe(true);
      expect(t1.indeterminate).toBe(false);
      expect(t1d1.checked).toBe(true);
      expect(t1d2.checked).toBe(false);
      expect(t1d3.checked).toBe(true);
      expect(t1d4.checked).toBe(true);

      t1.toggleChecked({
        directly: true,
      });
      expect(t1.checked).toBe(false);
      expect(t1.indeterminate).toBe(false);
      expect(t1d1.checked).toBe(true);
      expect(t1d2.checked).toBe(false);
      expect(t1d3.checked).toBe(false);
      expect(t1d4.checked).toBe(false);
    });
  });
});
