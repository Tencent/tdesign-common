import TreeStore from '../../../js/tree/tree-store';
import { delay } from './kit';

describe('tree', () => {
  describe('tree:append', () => {
    it('append 方法添加多个节点', async () => {
      const tree = new TreeStore();
      tree.append([{
        value: 't5'
      }, {
        value: 't6'
      }]);
      await delay(1);
      const nodes = tree.getNodes();
      // 内部生成的唯一 key 不应当绑定测试状态
      // 生成的唯一 key 与节点顺序无关，只需确保唯一
      expect(nodes[0].value).toBe('t5');
      expect(nodes[1].value).toBe('t6');
      expect(nodes.length).toBe(2);
    });
  });
});
