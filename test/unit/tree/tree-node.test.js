import TreeStore from '../../../js/tree/tree-store';
import TreeNode from '../../../js/tree/tree-node';
import { wait } from './kit';

describe('tree-node', () => {
  describe('tree-node basic', () => {
    it('TreeNode init', () => {
      const tree = new TreeStore();
      const node = new TreeNode(tree, {});
      expect(typeof node).toBe('object');
      expect(typeof node.value).toBe('string');
    });
  });

  describe('tree-node.setChecked', () => {
    it('TreeNode.setChecked changed checked property', async () => {
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
      await wait(1);
      const node1 = tree.getNode('t1');
      const checked = tree.getChecked();
      expect(node1.isChecked()).toBe(true);
      expect(node1.checked).toBe(true);
      expect(checked.length).toBe(1);
      expect(checked[0]).toBe('t1.1');
    });
  });
});
