import TreeStore from '../../../js/tree/tree-store';
import { delay } from './kit';

// 树数据重置
describe('tree:reload', () => {
  describe('treeStore:reload()', () => {
    it('reload 方法重设 tree 数据为空', async () => {
      const tree = new TreeStore({
        activable: true,
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
      tree.setExpanded(['t1']);
      tree.setActived(['t1.1']);
      tree.setChecked(['t1.2']);
      await delay(0);
      expect(tree.getExpanded().length).toBe(1);
      expect(tree.getChecked().length).toBe(1);
      expect(tree.getActived().length).toBe(1);
      tree.reload([]);
      await delay(0);
      const nodes = tree.getNodes();
      expect(nodes.length).toBe(0);
      expect(tree.getExpanded().length).toBe(0);
      expect(tree.getChecked().length).toBe(0);
      expect(tree.getActived().length).toBe(0);
    });
  });
});
