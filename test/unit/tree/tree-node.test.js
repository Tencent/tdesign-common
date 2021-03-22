import TreeStore from '../../../js/tree/tree-store';
import TreeNode from '../../../js/tree/tree-node';

describe('tree-node basic', () => {
  it('TreeNode init', () => {
    const tree = new TreeStore();
    const node = new TreeNode(tree, {});
    expect(typeof node).toBe('object');
    expect(typeof node.value).toBe('string');
  });
});
