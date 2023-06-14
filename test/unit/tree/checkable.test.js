import TreeStore from '../../../js/tree/tree-store';
import { delay } from './kit';

describe('tree:checkable', () => {
  describe('treeStore:checkable', () => {
    it('checkable 属性为 false 时, 无法设置选中项', async () => {
      const tree = new TreeStore({
        checkable: false,
      });
      tree.append([{
        value: 't1',
        children: [{
          value: 't1.1',
        }],
      }]);

      // 节点创建后，结构创建与回流是延时的
      await delay(0);
      tree.setChecked(['t1.1']);

      // 总体选中状态是延时更新的
      await delay(0);
      expect(tree.getChecked().length).toBe(0);
      const t1d1 = tree.getNode('t1.1');
      expect(t1d1.checked).toBe(false);
    });

    it('setChecked 方法可以修改选中属性', async () => {
      const tree = new TreeStore({
        checkable: true,
      });
      tree.append([{
        value: 't1',
        children: [{
          value: 't1.1',
        }],
      }]);

      // 节点创建后，结构创建与回流是延时的
      await delay(0);
      tree.setChecked(['t1']);

      // 总体选中状态是延时更新的
      await delay(0);
      const t1 = tree.getNode('t1');
      const checked = tree.getChecked();
      expect(t1.isChecked()).toBe(true);
      expect(t1.checked).toBe(true);
      expect(checked.length).toBe(1);
      expect(checked[0]).toBe('t1.1');
    });

    // 手动测试中发现，选中节点意外影响了节点的高亮状态
    // 添加此测试排除模型出错的可能性
    it('setChecked 方法不会影响其他属性', async () => {
      const tree = new TreeStore({
        checkable: true,
      });
      tree.append([{
        value: 't1',
        children: [{
          value: 't1.1',
        }],
      }]);

      // 节点创建后，结构创建与回流是延时的
      await delay(0);

      tree.setActived(['t1']);
      await delay(0);

      tree.setChecked(['t1']);
      await delay(0);

      const t1 = tree.getNode('t1');
      const checked = tree.getChecked();
      const actived = tree.getActived();

      expect(t1.checked).toBe(true);
      expect(checked.length).toBe(1);
      expect(checked[0]).toBe('t1.1');

      expect(t1.actived).toBe(true);
      expect(actived.length).toBe(1);
      expect(actived[0]).toBe('t1');
    });
  });

  describe('treeNode:checked', () => {
    it('关联选中态', async () => {
      const tree = new TreeStore({
        checkable: true,
      });
      tree.append([{
        value: 't1',
        children: [{
          value: 't1.1',
        }, {
          value: 't1.2',
        }],
      }]);

      // 节点创建后，结构创建与回流是延时的
      await delay(0);
      tree.setChecked(['t1']);

      // 选中状态是延时更新的
      await delay(0);

      const t1 = tree.getNode('t1');
      const t1d1 = tree.getNode('t1.1');
      const t1d2 = tree.getNode('t1.2');

      expect(t1.isChecked()).toBe(true);
      expect(t1.checked).toBe(true);
      expect(t1.isIndeterminate()).toBe(false);
      expect(t1.indeterminate).toBe(false);

      expect(t1d1.isChecked()).toBe(true);
      expect(t1d1.checked).toBe(true);
      expect(t1d1.isIndeterminate()).toBe(false);
      expect(t1d1.indeterminate).toBe(false);

      expect(t1d2.isChecked()).toBe(true);
      expect(t1d2.checked).toBe(true);
      expect(t1d2.isIndeterminate()).toBe(false);
      expect(t1d2.indeterminate).toBe(false);
    });

    it('半选状态', async () => {
      const tree = new TreeStore({
        checkable: true,
      });
      tree.append([{
        value: 't1',
        children: [{
          value: 't1.1',
        }, {
          value: 't1.2',
        }],
      }]);

      await delay(0);
      tree.setChecked(['t1.1']);

      // 选中状态是延时更新的
      await delay(0);

      const t1 = tree.getNode('t1');
      const t1d1 = tree.getNode('t1.1');
      const t1d2 = tree.getNode('t1.2');

      expect(t1.isChecked()).toBe(false);
      expect(t1.checked).toBe(false);
      expect(t1.isIndeterminate()).toBe(true);
      expect(t1.indeterminate).toBe(true);

      expect(t1d1.isChecked()).toBe(true);
      expect(t1d1.checked).toBe(true);
      expect(t1d1.isIndeterminate()).toBe(false);
      expect(t1d1.indeterminate).toBe(false);

      expect(t1d2.isChecked()).toBe(false);
      expect(t1d2.checked).toBe(false);
      expect(t1d2.isIndeterminate()).toBe(false);
      expect(t1d2.indeterminate).toBe(false);
    });

    it('选中态补足', async () => {
      const tree = new TreeStore({
        checkable: true,
      });
      tree.append([{
        value: 't1',
        children: [{
          value: 't1.1',
        }, {
          value: 't1.2',
        }],
      }]);

      await delay(0);
      const t1 = tree.getNode('t1');
      const t1d1 = tree.getNode('t1.1');
      const t1d2 = tree.getNode('t1.2');

      t1d1.setChecked(true, {
        directly: true,
      });
      await delay(0);
      expect(t1.checked).toBe(false);
      expect(t1.indeterminate).toBe(true);
      expect(t1d1.checked).toBe(true);
      expect(t1d1.indeterminate).toBe(false);
      expect(t1d2.checked).toBe(false);
      expect(t1d2.indeterminate).toBe(false);

      t1d2.setChecked(true, {
        directly: true,
      });
      await delay(0);
      expect(t1.checked).toBe(true);
      expect(t1.indeterminate).toBe(false);
      expect(t1d1.checked).toBe(true);
      expect(t1d1.indeterminate).toBe(false);
      expect(t1d2.checked).toBe(true);
      expect(t1d2.indeterminate).toBe(false);
    });

    it('选中态转换半选', async () => {
      const tree = new TreeStore({
        checkable: true,
      });
      tree.append([{
        value: 't1',
        children: [{
          value: 't1.1',
        }, {
          value: 't1.2',
        }],
      }]);

      await delay(0);
      const t1 = tree.getNode('t1');
      const t1d1 = tree.getNode('t1.1');
      const t1d2 = tree.getNode('t1.2');

      t1.setChecked(true, {
        directly: true,
      });
      await delay(0);
      expect(t1.checked).toBe(true);
      expect(t1.indeterminate).toBe(false);
      expect(t1d1.checked).toBe(true);
      expect(t1d1.indeterminate).toBe(false);
      expect(t1d2.checked).toBe(true);
      expect(t1d2.indeterminate).toBe(false);

      t1d2.setChecked(false, {
        directly: true,
      });
      await delay(0);
      expect(t1.checked).toBe(false);
      expect(t1.indeterminate).toBe(true);
      expect(t1d1.checked).toBe(true);
      expect(t1d1.indeterminate).toBe(false);
      expect(t1d2.checked).toBe(false);
      expect(t1d2.indeterminate).toBe(false);
    });

    it('选中态清空', async () => {
      const tree = new TreeStore({
        checkable: true,
      });
      tree.append([{
        value: 't1',
        children: [{
          value: 't1.1',
        }, {
          value: 't1.2',
        }],
      }]);

      await delay(0);
      const t1 = tree.getNode('t1');
      const t1d1 = tree.getNode('t1.1');
      const t1d2 = tree.getNode('t1.2');

      t1.setChecked(true, {
        directly: true,
      });
      await delay(0);
      expect(t1.checked).toBe(true);
      expect(t1.indeterminate).toBe(false);
      expect(t1d1.checked).toBe(true);
      expect(t1d1.indeterminate).toBe(false);
      expect(t1d2.checked).toBe(true);
      expect(t1d2.indeterminate).toBe(false);

      t1d1.setChecked(false, {
        directly: true,
      });
      t1d2.setChecked(false, {
        directly: true,
      });
      await delay(0);
      expect(t1.checked).toBe(false);
      expect(t1.indeterminate).toBe(false);
      expect(t1d1.checked).toBe(false);
      expect(t1d1.indeterminate).toBe(false);
      expect(t1d2.checked).toBe(false);
      expect(t1d2.indeterminate).toBe(false);
    });

    it('深层节点关联', async () => {
      const tree = new TreeStore({
        checkable: true,
      });
      tree.append([{
        value: 't1',
        children: [{
          value: 't1.1',
          children: [{
            value: 't1.1.1',
            children: [{
              value: 't1.1.1.1',
              children: [{
                value: 't1.1.1.1.1',
              }]
            }]
          }]
        }],
      }]);

      await delay(0);
      tree.setChecked(['t1.1.1']);

      await delay(0);
      expect(tree.getNode('t1').checked).toBe(true);
      expect(tree.getNode('t1.1').checked).toBe(true);
      expect(tree.getNode('t1.1.1').checked).toBe(true);
      expect(tree.getNode('t1.1.1.1').checked).toBe(true);
      expect(tree.getNode('t1.1.1.1.1').checked).toBe(true);

      tree.getNode('t1.1.1').setChecked(false, {
        directly: true,
      });
      await delay(0);
      expect(tree.getNode('t1').checked).toBe(false);
      expect(tree.getNode('t1.1').checked).toBe(false);
      expect(tree.getNode('t1.1.1').checked).toBe(false);
      expect(tree.getNode('t1.1.1.1').checked).toBe(false);
      expect(tree.getNode('t1.1.1.1.1').checked).toBe(false);
    });
  });

  describe('treeStore:valueMode', () => {
    it('valueMode 默认配置为 onlyLeaf', async () => {
      const tree = new TreeStore({
        checkable: true,
      });
      tree.append([{
        value: 't1',
        children: [{
          value: 't1.1',
        }, {
          value: 't1.2',
        }],
      }]);

      // 节点创建后，结构创建与回流是延时的
      await delay(0);
      tree.setChecked(['t1']);

      // 总体选中状态是延时更新的
      await delay(0);
      const checked = tree.getChecked();
      expect(checked.length).toBe(2);
      expect(checked[0]).toBe('t1.1');
      expect(checked[1]).toBe('t1.2');
    });

    it('valueMode 为 onlyLeaf 时的半选状态', async () => {
      const tree = new TreeStore({
        checkable: true,
      });
      tree.append([{
        value: 't1',
        children: [{
          value: 't1.1',
        }, {
          value: 't1.2',
        }],
      }]);

      await delay(0);
      tree.setChecked(['t1.1']);

      // 总体选中状态是延时更新的
      await delay(0);
      const checked = tree.getChecked();
      expect(checked.length).toBe(1);
      expect(checked[0]).toBe('t1.1');
    });

    it('valueMode 为 parentFirst', async () => {
      const tree = new TreeStore({
        checkable: true,
        valueMode: 'parentFirst',
      });
      tree.append([{
        value: 't1',
        children: [{
          value: 't1.1',
        }, {
          value: 't1.2',
        }],
      }]);

      // 节点创建后，结构创建与回流是延时的
      await delay(0);
      tree.setChecked(['t1']);

      // 总体选中状态是延时更新的
      await delay(0);
      const checked = tree.getChecked();
      expect(checked.length).toBe(1);
      expect(checked[0]).toBe('t1');
    });

    it('valueMode 为 parentFirst 的半选状态', async () => {
      const tree = new TreeStore({
        checkable: true,
        valueMode: 'parentFirst',
      });
      tree.append([{
        value: 't1',
        children: [{
          value: 't1.1',
          children: [{
            value: 't1.1.1',
          }, {
            value: 't1.1.2',
          }]
        }, {
          value: 't1.2',
          children: [{
            value: 't1.2.1',
          }, {
            value: 't1.2.2',
          }]
        }],
      }]);

      // 节点创建后，结构创建与回流是延时的
      await delay(0);
      tree.setChecked(['t1.1']);

      // 总体选中状态是延时更新的
      await delay(0);
      const checked = tree.getChecked();
      expect(checked.length).toBe(1);
      expect(checked[0]).toBe('t1.1');

      const t1 = tree.getNode('t1');
      const t1d1 = tree.getNode('t1.1');
      const t1d1d1 = tree.getNode('t1.1.1');
      const t1d1d2 = tree.getNode('t1.1.2');
      const t1d2 = tree.getNode('t1.2');
      const t1d2d1 = tree.getNode('t1.2.1');
      const t1d2d2 = tree.getNode('t1.2.2');

      expect(t1.isChecked()).toBe(false);
      expect(t1.checked).toBe(false);
      expect(t1.isIndeterminate()).toBe(true);
      expect(t1.indeterminate).toBe(true);

      expect(t1d1.isChecked()).toBe(true);
      expect(t1d1.checked).toBe(true);
      expect(t1d1.isIndeterminate()).toBe(false);
      expect(t1d1.indeterminate).toBe(false);

      expect(t1d1d1.isChecked()).toBe(true);
      expect(t1d1d1.checked).toBe(true);
      expect(t1d1d1.isIndeterminate()).toBe(false);
      expect(t1d1d1.indeterminate).toBe(false);

      expect(t1d1d2.isChecked()).toBe(true);
      expect(t1d1d2.checked).toBe(true);
      expect(t1d1d2.isIndeterminate()).toBe(false);
      expect(t1d1d2.indeterminate).toBe(false);

      expect(t1d2.isChecked()).toBe(false);
      expect(t1d2.checked).toBe(false);
      expect(t1d2.isIndeterminate()).toBe(false);
      expect(t1d2.indeterminate).toBe(false);

      expect(t1d2d1.isChecked()).toBe(false);
      expect(t1d2d1.checked).toBe(false);
      expect(t1d2d1.isIndeterminate()).toBe(false);
      expect(t1d2d1.indeterminate).toBe(false);

      expect(t1d2d2.isChecked()).toBe(false);
      expect(t1d2d2.checked).toBe(false);
      expect(t1d2d2.isIndeterminate()).toBe(false);
      expect(t1d2d2.indeterminate).toBe(false);
    });

    it('valueMode 为 all', async () => {
      const tree = new TreeStore({
        checkable: true,
        valueMode: 'all',
      });
      tree.append([{
        value: 't1',
        children: [{
          value: 't1.1',
        }, {
          value: 't1.2',
        }],
      }]);

      // 节点创建后，结构创建与回流是延时的
      await delay(0);
      tree.setChecked(['t1']);

      // 总体选中状态是延时更新的
      await delay(0);
      const checked = tree.getChecked();
      expect(checked.length).toBe(3);
      expect(checked[0]).toBe('t1');
      expect(checked[1]).toBe('t1.1');
      expect(checked[2]).toBe('t1.2');
    });

    it('valueMode 为 all 的半选状态', async () => {
      const tree = new TreeStore({
        checkable: true,
        valueMode: 'all',
      });
      tree.append([{
        value: 't1',
        children: [{
          value: 't1.1',
          children: [{
            value: 't1.1.1',
          }, {
            value: 't1.1.2',
          }]
        }, {
          value: 't1.2',
          children: [{
            value: 't1.2.1',
          }, {
            value: 't1.2.2',
          }]
        }],
      }]);

      // 节点创建后，结构创建与回流是延时的
      await delay(0);
      tree.setChecked(['t1.1']);

      // 总体选中状态是延时更新的
      await delay(0);
      const checked = tree.getChecked();
      expect(checked.length).toBe(3);
      expect(checked[0]).toBe('t1.1');
      expect(checked[1]).toBe('t1.1.1');
      expect(checked[2]).toBe('t1.1.2');

      const t1 = tree.getNode('t1');
      const t1d1 = tree.getNode('t1.1');
      const t1d1d1 = tree.getNode('t1.1.1');
      const t1d1d2 = tree.getNode('t1.1.2');
      const t1d2 = tree.getNode('t1.2');
      const t1d2d1 = tree.getNode('t1.2.1');
      const t1d2d2 = tree.getNode('t1.2.2');

      expect(t1.isChecked()).toBe(false);
      expect(t1.checked).toBe(false);
      expect(t1.isIndeterminate()).toBe(true);
      expect(t1.indeterminate).toBe(true);

      expect(t1d1.isChecked()).toBe(true);
      expect(t1d1.checked).toBe(true);
      expect(t1d1.isIndeterminate()).toBe(false);
      expect(t1d1.indeterminate).toBe(false);

      expect(t1d1d1.isChecked()).toBe(true);
      expect(t1d1d1.checked).toBe(true);
      expect(t1d1d1.isIndeterminate()).toBe(false);
      expect(t1d1d1.indeterminate).toBe(false);

      expect(t1d1d2.isChecked()).toBe(true);
      expect(t1d1d2.checked).toBe(true);
      expect(t1d1d2.isIndeterminate()).toBe(false);
      expect(t1d1d2.indeterminate).toBe(false);

      expect(t1d2.isChecked()).toBe(false);
      expect(t1d2.checked).toBe(false);
      expect(t1d2.isIndeterminate()).toBe(false);
      expect(t1d2.indeterminate).toBe(false);

      expect(t1d2d1.isChecked()).toBe(false);
      expect(t1d2d1.checked).toBe(false);
      expect(t1d2d1.isIndeterminate()).toBe(false);
      expect(t1d2d1.indeterminate).toBe(false);

      expect(t1d2d2.isChecked()).toBe(false);
      expect(t1d2d2.checked).toBe(false);
      expect(t1d2d2.isIndeterminate()).toBe(false);
      expect(t1d2d2.indeterminate).toBe(false);
    });
  });

  describe('treeStore:checkStrictly', () => {
    it('checkStrictly 为 true, valueMode 为 onlyLeaf', async () => {
      const tree = new TreeStore({
        checkStrictly: true,
        checkable: true,
      });
      tree.append([{
        value: 't1',
        children: [{
          value: 't1.1',
        }, {
          value: 't1.2',
        }],
      }]);

      await delay(0);
      tree.setChecked(['t1']);

      // 总体选中状态是延时更新的
      await delay(0);
      const checked = tree.getChecked();
      expect(checked.length).toBe(1);
      expect(checked[0]).toBe('t1');

      const t1 = tree.getNode('t1');
      const t1d1 = tree.getNode('t1.1');
      const t1d2 = tree.getNode('t1.2');

      expect(t1.isChecked()).toBe(true);
      expect(t1.checked).toBe(true);
      expect(t1.isIndeterminate()).toBe(false);
      expect(t1.indeterminate).toBe(false);

      expect(t1d1.isChecked()).toBe(false);
      expect(t1d1.checked).toBe(false);
      expect(t1d1.isIndeterminate()).toBe(false);
      expect(t1d1.indeterminate).toBe(false);

      expect(t1d2.isChecked()).toBe(false);
      expect(t1d2.checked).toBe(false);
      expect(t1d2.isIndeterminate()).toBe(false);
      expect(t1d2.indeterminate).toBe(false);
    });

    it('checkStrictly 为 true, valueMode 为 parentFirst', async () => {
      const tree = new TreeStore({
        checkStrictly: true,
        checkable: true,
        valueMode: 'parentFirst',
      });
      tree.append([{
        value: 't1',
        children: [{
          value: 't1.1',
        }, {
          value: 't1.2',
        }],
      }]);

      await delay(0);
      tree.setChecked(['t1', 't1.1']);

      // 总体选中状态是延时更新的
      await delay(0);
      const checked = tree.getChecked();
      expect(checked.length).toBe(2);
      expect(checked[0]).toBe('t1');
      expect(checked[1]).toBe('t1.1');

      const t1 = tree.getNode('t1');
      const t1d1 = tree.getNode('t1.1');
      const t1d2 = tree.getNode('t1.2');

      expect(t1.isChecked()).toBe(true);
      expect(t1.checked).toBe(true);
      expect(t1.isIndeterminate()).toBe(false);
      expect(t1.indeterminate).toBe(false);

      expect(t1d1.isChecked()).toBe(true);
      expect(t1d1.checked).toBe(true);
      expect(t1d1.isIndeterminate()).toBe(false);
      expect(t1d1.indeterminate).toBe(false);

      expect(t1d2.isChecked()).toBe(false);
      expect(t1d2.checked).toBe(false);
      expect(t1d2.isIndeterminate()).toBe(false);
      expect(t1d2.indeterminate).toBe(false);
    });

    it('checkStrictly 为 true, valueMode 为 all', async () => {
      const tree = new TreeStore({
        checkStrictly: true,
        checkable: true,
        valueMode: 'all',
      });
      tree.append([{
        value: 't1',
        children: [{
          value: 't1.1',
        }, {
          value: 't1.2',
        }],
      }]);

      await delay(0);
      tree.setChecked(['t1', 't1.1']);

      // 总体选中状态是延时更新的
      await delay(0);
      const checked = tree.getChecked();
      expect(checked.length).toBe(2);
      expect(checked[0]).toBe('t1');
      expect(checked[1]).toBe('t1.1');

      const t1 = tree.getNode('t1');
      const t1d1 = tree.getNode('t1.1');
      const t1d2 = tree.getNode('t1.2');

      expect(t1.isChecked()).toBe(true);
      expect(t1.checked).toBe(true);
      expect(t1.isIndeterminate()).toBe(false);
      expect(t1.indeterminate).toBe(false);

      expect(t1d1.isChecked()).toBe(true);
      expect(t1d1.checked).toBe(true);
      expect(t1d1.isIndeterminate()).toBe(false);
      expect(t1d1.indeterminate).toBe(false);

      expect(t1d2.isChecked()).toBe(false);
      expect(t1d2.checked).toBe(false);
      expect(t1d2.isIndeterminate()).toBe(false);
      expect(t1d2.indeterminate).toBe(false);
    });
  });

  describe('treeNode:initChecked', () => {
    it('父节点选中，插入子节点均为选中', async () => {
      const tree = new TreeStore({
        checkable: true,
      });
      tree.append([{
        value: 't1',
        children: [{
          value: 't1.1',
        }, {
          value: 't1.2',
        }],
      }]);

      // 节点创建后，结构创建与回流是延时的
      await delay(0);
      tree.setChecked(['t1']);

      const t1 = tree.getNode('t1');
      const t1d1 = tree.getNode('t1.1');
      const t1d2 = tree.getNode('t1.2');

      // 总体选中状态是延时更新的
      await delay(0);
      expect(t1.checked).toBe(true);
      expect(t1d1.checked).toBe(true);
      expect(t1d2.checked).toBe(true);

      tree.appendNodes('t1', {
        value: 't1.3'
      });
      await delay(0);
      expect(tree.getNode('t1.3').checked).toBe(true);

      tree.appendNodes('t1.1', {
        value: 't1.1.1'
      });
      await delay(0);
      expect(tree.getNode('t1.1.1').checked).toBe(true);

      tree.insertBefore('t1.1', {
        value: 't1.0',
      });
      await delay(0);
      expect(tree.getNode('t1.0').checked).toBe(true);

      tree.insertAfter('t1.3', {
        value: 't1.4',
      });
      await delay(0);
      expect(tree.getNode('t1.4').checked).toBe(true);

      tree.appendNodes({
        value: 't2'
      });
      await delay(0);
      expect(tree.getNode('t2').checked).toBe(false);

      tree.appendNodes('t2', {
        value: 't2.1'
      });
      await delay(0);
      expect(tree.getNode('t2.1').checked).toBe(false);
    });
  });

  describe('treeStore:getCheckedNodes', () => {
    it('获取所有选中节点', async () => {
      const tree = new TreeStore({
        checkable: true,
      });
      tree.append([{
        value: 't1',
        children: [{
          value: 't1.1',
          children: [{
            value: 't1.1.1',
          }, {
            value: 't1.1.2',
          }],
        }, {
          value: 't1.2',
          children: [{
            value: 't1.2.1',
          }, {
            value: 't1.2.2',
          }],
        }],
      }]);

      // 节点创建后，结构创建与回流是延时的
      await delay(0);
      tree.setChecked(['t1.1', 't1.2.1']);
      await delay(0);

      const checkedNodes = tree.getCheckedNodes();
      expect(checkedNodes.length).toBe(4);
      expect(checkedNodes[0].value).toBe('t1.1');
      expect(checkedNodes[1].value).toBe('t1.1.1');
      expect(checkedNodes[2].value).toBe('t1.1.2');
      expect(checkedNodes[3].value).toBe('t1.2.1');
    });

    it('获取目标节点下的选中节点', async () => {
      const tree = new TreeStore({
        checkable: true,
      });
      tree.append([{
        value: 't1',
        children: [{
          value: 't1.1',
          children: [{
            value: 't1.1.1',
          }, {
            value: 't1.1.2',
          }],
        }, {
          value: 't1.2',
          children: [{
            value: 't1.2.1',
          }, {
            value: 't1.2.2',
          }],
        }],
      }]);

      // 节点创建后，结构创建与回流是延时的
      await delay(0);
      tree.setChecked(['t1.1', 't1.2.1']);
      await delay(0);

      const checkedNodes = tree.getCheckedNodes('t1.1');
      expect(checkedNodes.length).toBe(3);
      expect(checkedNodes[0].value).toBe('t1.1');
      expect(checkedNodes[1].value).toBe('t1.1.1');
      expect(checkedNodes[2].value).toBe('t1.1.2');
    });

    it('目标节点不存在，则无法取得选中节点', async () => {
      const tree = new TreeStore({
        checkable: true,
      });
      tree.append([{
        value: 't1',
        children: [{
          value: 't1.1',
          children: [{
            value: 't1.1.1',
          }, {
            value: 't1.1.2',
          }],
        }, {
          value: 't1.2',
          children: [{
            value: 't1.2.1',
          }, {
            value: 't1.2.2',
          }],
        }],
      }]);

      // 节点创建后，结构创建与回流是延时的
      await delay(0);
      tree.setChecked(['t1.1', 't1.2.1']);
      await delay(0);

      const checkedNodes = tree.getCheckedNodes('t1.3');
      expect(checkedNodes.length).toBe(0);
    });
  });

  describe('treeStore:setChecked', () => {
    it('setChecked 可新增选中节点', async () => {
      const tree = new TreeStore({
        checkable: true,
      });
      tree.append([{
        value: 't1',
        children: [{
          value: 't1.1',
          children: [{
            value: 't1.1.1',
          }, {
            value: 't1.1.2',
          }],
        }, {
          value: 't1.2',
          children: [{
            value: 't1.2.1',
          }, {
            value: 't1.2.2',
          }],
        }],
      }]);

      await delay(0);
      tree.setChecked(['t1.2.1']);
      tree.setChecked(['t1.1']);
      await delay(0);
      const checked = tree.getChecked();
      expect(checked.length).toBe(3);
      expect(checked[0]).toBe('t1.1.1');
      expect(checked[1]).toBe('t1.1.2');
      expect(checked[2]).toBe('t1.2.1');
    });
  });

  describe('treeStore:replaceChecked', () => {
    it('replaceChecked 可重设选中节点', async () => {
      const tree = new TreeStore({
        checkable: true,
      });
      tree.append([{
        value: 't1',
        children: [{
          value: 't1.1',
          children: [{
            value: 't1.1.1',
          }, {
            value: 't1.1.2',
          }],
        }, {
          value: 't1.2',
          children: [{
            value: 't1.2.1',
          }, {
            value: 't1.2.2',
          }],
        }],
      }]);

      // 节点创建后，结构创建与回流是延时的
      await delay(0);
      tree.setChecked(['t1.1', 't1.2.1']);
      await delay(0);
      let checked = tree.getChecked();
      expect(checked.length).toBe(3);
      expect(checked[0]).toBe('t1.1.1');
      expect(checked[1]).toBe('t1.1.2');
      expect(checked[2]).toBe('t1.2.1');

      tree.replaceChecked(['t1.2.2']);
      await delay(0);
      checked = tree.getChecked();
      expect(checked.length).toBe(1);
      expect(checked[0]).toBe('t1.2.2');
    });
  });
});
