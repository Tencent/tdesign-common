import TreeStore from '../../../js/tree/tree-store';

// 禁用状态
// 原则:
// 1. 值操作与禁用与否无关, treeStore 上的选中操作，不受禁用影响
// 2. treeNode 上的 setChecked 方法，受禁用影响
// 3. 选中态向下传播时，受节点禁用状态影响，向上传播不影响
describe('tree:disabled', () => {
  describe('treeStore:setChecked', () => {
    it('整个树为禁用状态，值操作可以选中节点', async () => {
      const tree = new TreeStore({
        checkable: true,
        disabled: true,
      });
      tree.append([{
        value: 't1',
        children: [{
          value: 't1.1',
        }],
      }]);

      tree.setChecked(['t1.1']);
      expect(tree.getChecked().length).toBe(1);
      const t1 = tree.getNode('t1');
      const t1d1 = tree.getNode('t1.1');
      expect(t1.checked).toBe(true);
      expect(t1d1.checked).toBe(true);
    });
  });

  describe('treeStore:replaceChecked()', () => {
    it('整个树为禁用状态，重设选中态不受影响', async () => {
      const tree = new TreeStore({
        checkable: true,
        disabled: true,
      });
      tree.append([{
        value: 't1',
        children: [{
          value: 't1.1',
          checked: true,
        }, {
          value: 't1.2',
          checked: true,
        }],
      }, {
        value: 't2',
        children: [{
          value: 't2.1',
        }, {
          value: 't2.2',
        }],
      }]);

      expect(tree.getNode('t1').checked).toBe(true);
      expect(tree.getNode('t2').checked).toBe(false);

      tree.replaceChecked(['t2.1', 't2.2']);
      expect(tree.getNode('t1').checked).toBe(false);
      expect(tree.getNode('t2').checked).toBe(true);
      const checked = tree.getChecked();
      expect(checked.length).toBe(2);
      expect(checked[0]).toBe('t2.1');
      expect(checked[1]).toBe('t2.2');
    });
  });

  describe('treeNode:initChecked()', () => {
    it('整个树为禁用状态，初始化选中态不受影响', async () => {
      const tree = new TreeStore({
        checkable: true,
        disabled: true,
      });
      tree.append([{
        value: 't1',
        children: [{
          value: 't1.1',
          checked: true,
        }, {
          value: 't1.2',
          checked: true,
        }],
      }, {
        value: 't2',
        children: [{
          value: 't2.1',
        }, {
          value: 't2.2',
        }],
      }]);

      const checked = tree.getChecked();
      expect(checked.length).toBe(2);
      expect(checked[0]).toBe('t1.1');
      expect(checked[1]).toBe('t1.2');
      expect(tree.getNode('t1').isChecked()).toBe(true);
      expect(tree.getNode('t1').checked).toBe(true);
    });
  });

  describe('treeNode:setChecked()', () => {
    it('整个树为禁用状态, UI check 无法切换选中态', async () => {
      const tree = new TreeStore({
        checkable: true,
        disabled: true,
      });
      tree.append([{
        value: 't1',
        children: [{
          value: 't1.1',
        }],
      }]);

      const t1 = tree.getNode('t1');
      const t1d1 = tree.getNode('t1.1');

      tree.getNode('t1.1').setChecked(true, {
        directly: true,
      });
      expect(t1.checked).toBe(false);
      expect(t1d1.checked).toBe(false);
    });

    it('整个树为禁用状态, 直接设值可以切换选中态', async () => {
      const tree = new TreeStore({
        checkable: true,
        disabled: true,
      });
      tree.append([{
        value: 't1',
        children: [{
          value: 't1.1',
        }],
      }]);

      const t1 = tree.getNode('t1');
      const t1d1 = tree.getNode('t1.1');

      tree.getNode('t1.1').setChecked(true, {
        isAction: false,
        directly: true,
      });
      expect(t1.checked).toBe(true);
      expect(t1d1.checked).toBe(true);
    });

    it('UI check 向下扩散被 disabled 阻塞', async () => {
      const tree = new TreeStore({
        checkable: true,
      });
      tree.append([{
        value: 't1',
        children: [{
          value: 't1.1',
          disabled: true,
        }, {
          value: 't1.2',
          disabled: true,
        }],
      }]);

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

    it('UI check 向下扩散被 disabled 阻塞产生半选', async () => {
      const tree = new TreeStore({
        checkable: true,
      });
      tree.append([{
        value: 't1',
        children: [{
          value: 't1.1',
          disabled: true,
        }, {
          value: 't1.2',
        }],
      }]);

      const t1 = tree.getNode('t1');
      const t1d1 = tree.getNode('t1.1');
      const t1d2 = tree.getNode('t1.2');

      tree.getNode('t1').setChecked(true, {
        directly: true,
      });
      expect(t1.checked).toBe(false);
      expect(t1.indeterminate).toBe(true);
      expect(t1d1.checked).toBe(false);
      expect(t1d2.checked).toBe(true);
    });

    it('UI check 向上扩散不被 disabled 阻塞', async () => {
      const tree = new TreeStore({
        checkable: true,
      });
      tree.append([{
        value: 't1',
        disabled: true,
        children: [{
          value: 't1.1',
        }, {
          value: 't1.2',
        }],
      }]);

      const t1 = tree.getNode('t1');
      const t1d1 = tree.getNode('t1.1');
      const t1d2 = tree.getNode('t1.2');

      tree.getNode('t1').setChecked(true, {
        directly: true,
      });
      expect(t1.checked).toBe(false);
      expect(t1.indeterminate).toBe(false);
      expect(t1d1.checked).toBe(false);
      expect(t1d2.checked).toBe(false);

      tree.getNode('t1.1').setChecked(true, {
        directly: true,
      });
      expect(t1.checked).toBe(false);
      expect(t1.indeterminate).toBe(true);
      expect(t1d1.checked).toBe(true);
      expect(t1d2.checked).toBe(false);

      tree.getNode('t1.2').setChecked(true, {
        directly: true,
      });
      expect(t1.checked).toBe(true);
      expect(t1.indeterminate).toBe(false);
      expect(t1d1.checked).toBe(true);
      expect(t1d2.checked).toBe(true);
    });
  });
});
