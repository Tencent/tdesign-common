import TreeStore from '../../../js/tree/tree-store';
import TreeNode from '../../../js/tree/tree-node';

// 树组件初始化
describe('tree:init', () => {
  describe('treeStore:init', () => {
    it('TreeStore 初始化空数据', () => {
      const tree = new TreeStore();
      expect(typeof tree).toBe('object');
      expect(typeof tree.config).toBe('object');
    });

    it('TreeNode 初始化空节点', () => {
      const tree = new TreeStore();
      const node = new TreeNode(tree, {});
      expect(typeof node).toBe('object');
      expect(typeof node.value).toBe('string');
    });

    it('TreeNode 初始化正常数据', () => {
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
