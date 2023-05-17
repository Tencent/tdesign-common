import TreeStore from '../../../js/tree/tree-store';
import { delay } from './kit';

describe('tree', () => {
  describe('tree:checked', () => {
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
      tree.setChecked(['t1']);

      // 总体选中状态是延时更新的
      await delay(1);
      const node1 = tree.getNode('t1');
      const checked = tree.getChecked();
      expect(node1.isChecked()).toBe(true);
      expect(node1.checked).toBe(true);
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

      tree.setActived(['t1']);
      await delay(1);

      tree.setChecked(['t1']);
      await delay(1);

      const node1 = tree.getNode('t1');
      const checked = tree.getChecked();
      const actived = tree.getActived();

      expect(node1.checked).toBe(true);
      expect(checked.length).toBe(1);
      expect(checked[0]).toBe('t1.1');

      expect(node1.actived).toBe(true);
      expect(actived.length).toBe(1);
      expect(actived[0]).toBe('t1');
    });
  });
});
