import TreeStore from '../../../js/tree/tree-store';
import { delay } from './kit';

// 节点过滤
describe('tree:filter', () => {
  describe('treeStore:filter', () => {
    it('filter 命中节点要呈现，默认路径节点必须呈现', async () => {
      const tree = new TreeStore();
      tree.append([{
        value: 't1',
        children: [{
          value: 't1.1',
        }, {
          value: 't1.2',
        }],
      }, {
        value: 't2',
        children: [{
          value: 't2.1',
        }, {
          value: 't2.2',
        }],
      }]);
      tree.setConfig({
        filter: (node) => {
          const rs = (node.value.indexOf('.1') >= 0);
          return rs;
        },
      });
      await delay(0);

      expect(tree.getNode('t1').visible).toBe(true);
      expect(tree.getNode('t1').expanded).toBe(true);
      expect(tree.getNode('t1').vmIsLocked).toBe(true);
      expect(tree.getNode('t1').isRest()).toBe(false);

      expect(tree.getNode('t1.1').visible).toBe(true);
      expect(tree.getNode('t1.1').isRest()).toBe(true);
      expect(tree.getNode('t1.2').visible).toBe(false);
      expect(tree.getNode('t1.2').isRest()).toBe(false);

      expect(tree.getNode('t2').visible).toBe(true);
      expect(tree.getNode('t2').expanded).toBe(true);
      expect(tree.getNode('t2').vmIsLocked).toBe(true);
      expect(tree.getNode('t2').isRest()).toBe(false);

      expect(tree.getNode('t2.1').visible).toBe(true);
      expect(tree.getNode('t2.1').isRest()).toBe(true);
      expect(tree.getNode('t2.2').visible).toBe(false);
      expect(tree.getNode('t2.2').isRest()).toBe(false);
    });
  });

  describe('treeStore:allowFoldNodeOnFilter', () => {
    it('todo', async () => {
      await delay(0);
    });
  });
});
