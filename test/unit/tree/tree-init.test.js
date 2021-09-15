import * as TreeStore from '../../../js/tree/tree-store.ts';
import * as TreeNode from '../../../js/tree/tree-node.ts';

/**
 * ```bash
 * # 针对 tree 组件单独调用测试命令
 * npx jest --config test/script/jest.unit.conf.js --coverage ./test/unit/tree
 * ```
 * */

describe('tree', () => {
  describe('tree:init', () => {
    it('TreeStore init empty tree', () => {
      const tree = new TreeStore();
      expect(typeof tree).toBe('object');
      expect(typeof tree.config).toBe('object');
    });

    it('TreeNode init empty node', () => {
      const tree = new TreeStore();
      const node = new TreeNode(tree, {});
      expect(typeof node).toBe('object');
      expect(typeof node.value).toBe('string');
    });

    it('TreeNode init tree data', () => {
      const tree = new TreeStore();
      const node = new TreeNode(tree, {
        value: '1',
        children: [{
          value: '1.1',
        }],
      });
      expect(typeof node).toBe('object');
      expect(node.value).toBe('1');
      expect(Array.isArray(node.children)).toBe(true);
      expect(node.children[0].value).toBe('1.1');
    });
  });
});
