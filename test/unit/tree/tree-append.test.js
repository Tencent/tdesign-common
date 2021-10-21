import TreeStore from '../../../js/tree/tree-store';
import { wait } from './kit';

describe('tree', () => {
  describe('tree:append', () => {
    it('append 方法添加多个节点', async () => {
      const tree = new TreeStore();
      tree.append([{}, {}]);
      await wait(1);
      const nodes = tree.getNodes();
      expect(nodes[0].value).toBe('t1');
      expect(nodes[1].value).toBe('t2');
    });
  });
});
