import TreeStore from '../../../js/tree/tree-store';
import { delay } from './kit';

describe('tree', () => {
  // describe('tree:checkable', () => {
  //   it('checkable 属性为 false 时, 无法设置选中项', async () => {
  //     const tree = new TreeStore({
  //       checkable: false,
  //     });
  //     tree.append([{
  //       value: 't1',
  //       children: [{
  //         value: 't1.1',
  //       }],
  //     }]);
  //     tree.setChecked(['t1.1']);

  //     // 总体选中状态是延时更新的
  //     await delay(1);
  //     expect(tree.getChecked().length).toBe(0);
  //     const node1 = tree.getNode('t1.1');
  //     expect(node1.checked).toBe(false);
  //   });

  //   it('setChecked 方法可以修改选中属性', async () => {
  //     const tree = new TreeStore({
  //       checkable: true,
  //     });
  //     tree.append([{
  //       value: 't1',
  //       children: [{
  //         value: 't1.1',
  //       }],
  //     }]);
  //     tree.setChecked(['t1']);

  //     // 总体选中状态是延时更新的
  //     await delay(1);
  //     const node1 = tree.getNode('t1');
  //     const checked = tree.getChecked();
  //     expect(node1.isChecked()).toBe(true);
  //     expect(node1.checked).toBe(true);
  //     expect(checked.length).toBe(1);
  //     expect(checked[0]).toBe('t1.1');
  //   });

  //   // 手动测试中发现，选中节点意外影响了节点的高亮状态
  //   // 添加此测试排除模型出错的可能性
  //   it('setChecked 方法不会影响其他属性', async () => {
  //     const tree = new TreeStore({
  //       checkable: true,
  //     });
  //     tree.append([{
  //       value: 't1',
  //       children: [{
  //         value: 't1.1',
  //       }],
  //     }]);

  //     tree.setActived(['t1']);
  //     await delay(1);

  //     tree.setChecked(['t1']);
  //     await delay(1);

  //     const node1 = tree.getNode('t1');
  //     const checked = tree.getChecked();
  //     const actived = tree.getActived();

  //     expect(node1.checked).toBe(true);
  //     expect(checked.length).toBe(1);
  //     expect(checked[0]).toBe('t1.1');

  //     expect(node1.actived).toBe(true);
  //     expect(actived.length).toBe(1);
  //     expect(actived[0]).toBe('t1');
  //   });
  // });

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
      tree.setChecked(['t1']);

      // 总体选中状态是延时更新的
      await delay(1);
      const checked = tree.getChecked();
      expect(checked.length).toBe(2);
      expect(checked[0]).toBe('t1.1');
      expect(checked[1]).toBe('t1.2');
      expect(tree.getNode('t1').isChecked()).toBe(true);
      expect(tree.getNode('t1').checked).toBe(true);
      expect(tree.getNode('t1.1').isChecked()).toBe(true);
      expect(tree.getNode('t1.1').checked).toBe(true);
      expect(tree.getNode('t1.2').isChecked()).toBe(true);
      expect(tree.getNode('t1.2').checked).toBe(true);
    });
  });
});
