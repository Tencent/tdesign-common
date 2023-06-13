import TreeStore from '../../../js/tree/tree-store';
import { delay } from './kit';

describe('tree', () => {
  describe('tree:checkable', () => {
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
      await delay(1);
      tree.setChecked(['t1.1']);

      // 总体选中状态是延时更新的
      await delay(1);
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
      await delay(1);
      tree.setChecked(['t1']);

      // 总体选中状态是延时更新的
      await delay(1);
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
      await delay(1);

      tree.setActived(['t1']);
      await delay(1);

      tree.setChecked(['t1']);
      await delay(1);

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

  describe('tree:checked', () => {
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
      await delay(1);
      tree.setChecked(['t1']);

      // 选中状态是延时更新的
      await delay(1);

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

      await delay(1);
      tree.setChecked(['t1.1']);

      // 选中状态是延时更新的
      await delay(1);

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
  });

  describe('tree:valueMode', () => {
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
      await delay(1);
      tree.setChecked(['t1']);

      // 总体选中状态是延时更新的
      await delay(1);
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

      await delay(1);
      tree.setChecked(['t1.1']);

      // 总体选中状态是延时更新的
      await delay(1);
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
      await delay(1);
      tree.setChecked(['t1']);

      // 总体选中状态是延时更新的
      await delay(1);
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
      await delay(1);
      tree.setChecked(['t1.1']);

      // 总体选中状态是延时更新的
      await delay(1);
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
      await delay(1);
      tree.setChecked(['t1']);

      // 总体选中状态是延时更新的
      await delay(1);
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
      await delay(1);
      tree.setChecked(['t1.1']);

      // 总体选中状态是延时更新的
      await delay(1);
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
});
