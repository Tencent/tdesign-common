import TreeStore from '../../../js/tree/tree-store';
import { delay } from './kit';

// 禁用状态
// 原则:
// 1. 值操作与禁用与否无关, treeStore 上的选中操作，不受禁用影响
// 2. treeNode 上的 setChecked 方法，受禁用影响
// 3. 选中态向下传播时，受节点禁用状态影响，向上传播不影响
describe('tree:disabled', () => {
  describe('treeStore:disabled', () => {
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

      // 节点创建后，结构创建与回流是延时的
      await delay(0);
      tree.setChecked(['t1.1']);

      // 总体选中状态是延时更新的
      await delay(0);
      expect(tree.getChecked().length).toBe(1);
      const t1 = tree.getNode('t1');
      const t1d1 = tree.getNode('t1.1');
      expect(t1.checked).toBe(true);
      expect(t1d1.checked).toBe(true);
    });

    // it('整个树为禁用状态，节点不可从未选中变为选中', async () => {
    //   const tree = new TreeStore({
    //     checkable: true,
    //     disabled: true,
    //   });
    //   tree.append([{
    //     value: 't1',
    //     children: [{
    //       value: 't1.1',
    //     }],
    //   }]);

    //   await delay(0);
    //   tree.getNode('t1').setChecked(true, {
    //     directly: true,
    //   });

    //   await delay(0);
    //   expect(tree.getChecked().length).toBe(0);
    //   expect(tree.getNode('t1').isChecked()).toBe(false);
    //   expect(tree.getNode('t1.1').isChecked()).toBe(false);
    // });

    // it('整个树为禁用状态，节点不可从选中变为未选中', async () => {
    //   const tree = new TreeStore({
    //     checkable: true,
    //     disabled: true,
    //   });
    //   tree.append([{
    //     value: 't1',
    //     checked: true,
    //     children: [{
    //       value: 't1.1',
    //     }],
    //   }]);

    //   await delay(0);
    //   tree.getNode('t1').setChecked(false, {
    //     directly: true,
    //   });

    //   await delay(0);
    //   const checked = tree.getChecked();
    //   expect(checked.length).toBe(1);
    //   expect(checked[0]).toBe('t1.1');
    //   expect(tree.getNode('t1').isChecked()).toBe(true);
    //   expect(tree.getNode('t1.1').isChecked()).toBe(true);
    // });
  });

  // describe('treeNode:disabled', () => {
  //   it('单个节点设置为禁用状态，如果节点本身为选中态，则关联选中态不可变更', async () => {
  //     const tree = new TreeStore({
  //       checkable: true,
  //       disabled: true,
  //     });
  //     tree.append([{
  //       value: 't1',
  //       children: [{
  //         value: 't1.1',
  //       }],
  //     }]);

  //     // 节点创建后，结构创建与回流是延时的
  //     await delay(0);
  //     tree.setChecked(['t1.1']);

  //     // 总体选中状态是延时更新的
  //     await delay(0);
  //     expect(tree.getChecked().length).toBe(0);
  //     const t1 = tree.getNode('t1');
  //     const t1d1 = tree.getNode('t1.1');
  //     expect(t1.checked).toBe(false);
  //     expect(t1d1.checked).toBe(false);
  //   });
  // });
});
