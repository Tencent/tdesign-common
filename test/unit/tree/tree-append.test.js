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

  describe('tree:appendNodes', () => {
    it('appendNodes 方法添加节点', async () => {
      const tree = new TreeStore();
      tree.append([{
        value: 't1'
      }, {
        value: 't2'
      }]);
      tree.appendNodes({
        value: 't3'
      });
      await delay(1);
      const nodes = tree.getNodes();
      expect(nodes.length).toBe(3);
      expect(nodes[2].value).toBe('t3');
    });

    it('appendNodes 从一个树插入到另一个树', async () => {
      const tree1 = new TreeStore();
      const tree2 = new TreeStore();
      tree1.append([{
        value: 't1'
      }, {
        value: 't2'
      }]);
      tree2.append([{
        value: 't3'
      }, {
        value: 't4'
      }]);
      const targetNode = tree2.getNode('t4');
      tree1.appendNodes(targetNode);
      await delay(1);
      const nodes = tree1.getNodes();
      expect(nodes.length).toBe(3);
      expect(nodes[2].value).toBe('t4');
    });

    it('appendNodes 方法添加节点数据到另一个节点 children', async () => {
      const tree = new TreeStore();
      tree.append([{
        value: 't1'
      }, {
        value: 't2'
      }]);
      tree.appendNodes('t1', {
        value: 't1.1'
      });
      tree.appendNodes(tree.getNode('t2'), {
        value: 't2.1'
      });
      await delay(1);
      const nodes = tree.getNodes();
      expect(nodes.length).toBe(4);
      expect(tree.getNode('t1.1').getParent().value).toBe('t1');
      expect(tree.getNode('t2.1').getParent().value).toBe('t2');
    });

    it('appendNodes 方法添加节点到另一个节点 children', async () => {
      const tree1 = new TreeStore();
      tree1.append([{
        value: 't1'
      }, {
        value: 't2'
      }]);
      const tree2 = new TreeStore();
      tree2.append([{
        value: 't3'
      }, {
        value: 't4'
      }]);
      tree1.appendNodes('t1', tree2.getNode('t3'));
      tree1.appendNodes(tree1.getNode('t2'), tree2.getNode('t4'));
      await delay(1);
      const nodes = tree1.getNodes();
      expect(nodes.length).toBe(4);
      expect(tree1.getNode('t3').getParent().value).toBe('t1');
      expect(tree1.getNode('t4').getParent().value).toBe('t2');
    });
  });

  describe('tree:insertBefore', () => {
    it('insertBefore 方法插入节点到前面', async () => {
      const tree = new TreeStore();
      tree.append([{
        value: 't1'
      }, {
        value: 't2'
      }]);
      tree.insertBefore('t2', {
        value: 't3',
      });
      tree.insertBefore('t1', {
        value: 't4',
      });
      await delay(1);
      const nodes = tree.getNodes();
      expect(nodes.length).toBe(4);
      expect(nodes[0].value).toBe('t4');
      expect(nodes[1].value).toBe('t1');
      expect(nodes[2].value).toBe('t3');
      expect(nodes[3].value).toBe('t2');
    });

    it('insertBefore 方法插入节点到子节点', async () => {
      const tree = new TreeStore();
      tree.append([{
        value: 't1',
        children: [{
          value: 't1.1',
        }, {
          value: 't1.2',
        }]
      }]);
      tree.insertBefore('t1.2', {
        value: 't1.3',
      });
      await delay(1);
      const nodes = tree.getNodes();
      expect(nodes.length).toBe(4);
      expect(tree.getNode('t1.1').getIndex()).toBe(0);
      expect(tree.getNode('t1.3').getIndex()).toBe(1);
      expect(tree.getNode('t1.2').getIndex()).toBe(2);
    });

    it('insertBefore 方法插入节点到不存在位置', async () => {
      const tree = new TreeStore();
      tree.append([{
        value: 't1',
        children: [{
          value: 't1.1',
        }, {
          value: 't1.2',
        }]
      }]);
      tree.insertBefore('t1.3', {
        value: 't1.4',
      });
      await delay(1);
      const nodes = tree.getNodes();
      expect(nodes.length).toBe(3);
      expect(tree.getNode('t1.1').getIndex()).toBe(0);
      expect(tree.getNode('t1.2').getIndex()).toBe(1);
    });
  });

  describe('tree:insertAfter', () => {
    it('insertAfter 方法插入节点到后面', async () => {
      const tree = new TreeStore();
      tree.append([{
        value: 't1'
      }, {
        value: 't2'
      }]);
      tree.insertAfter('t2', {
        value: 't3',
      });
      tree.insertAfter('t1', {
        value: 't4',
      });
      await delay(1);
      const nodes = tree.getNodes();
      expect(nodes.length).toBe(4);
      expect(nodes[0].value).toBe('t1');
      expect(nodes[1].value).toBe('t4');
      expect(nodes[2].value).toBe('t2');
      expect(nodes[3].value).toBe('t3');
    });

    it('insertAfter 方法插入节点到子节点', async () => {
      const tree = new TreeStore();
      tree.append([{
        value: 't1',
        children: [{
          value: 't1.1',
        }, {
          value: 't1.2',
        }]
      }]);
      tree.insertAfter('t1.2', {
        value: 't1.3',
      });
      await delay(1);
      const nodes = tree.getNodes();
      expect(nodes.length).toBe(4);
      expect(tree.getNode('t1.1').getIndex()).toBe(0);
      expect(tree.getNode('t1.2').getIndex()).toBe(1);
      expect(tree.getNode('t1.3').getIndex()).toBe(2);
    });

    it('insertAfter 方法插入节点到不存在位置', async () => {
      const tree = new TreeStore();
      tree.append([{
        value: 't1',
        children: [{
          value: 't1.1',
        }, {
          value: 't1.2',
        }]
      }]);
      tree.insertAfter('t1.3', {
        value: 't1.4',
      });
      await delay(1);
      const nodes = tree.getNodes();
      expect(nodes.length).toBe(3);
      expect(tree.getNode('t1.1').getIndex()).toBe(0);
      expect(tree.getNode('t1.2').getIndex()).toBe(1);
    });
  });
});
