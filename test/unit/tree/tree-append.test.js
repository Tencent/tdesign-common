import TreeStore from '../../../js/tree/tree-store.ts';
import { wait } from './kit';

describe('tree', () => {
  describe('tree:append', () => {
    it('TreeStore.append get multi nodes', async () => {
      const tree = new TreeStore();
      tree.append([{}, {}]);
      await wait(1);
      const nodes = tree.getNodes();
      expect(nodes[0].value).toBe('t1');
      expect(nodes[1].value).toBe('t2');
    });
  });
});
