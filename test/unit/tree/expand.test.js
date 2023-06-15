import TreeStore from '../../../js/tree/tree-store';
import { delay } from './kit';

// 节点展开状态
describe('tree:expand', () => {
  describe('treeStore:expandAll', () => {
    it('expandAll 为 true 时，默认新增节点为展开状态', async () => {
      const tree = new TreeStore({
        expandAll: true,
      });
      tree.append([{
        value: 't1',
        children: [{
          value: 't1.1',
        }],
      }, {
        value: 't2',
        children: [{
          value: 't2.1',
        }],
      }]);

      await delay(0);
      expect(tree.getNode('t1').isExpanded()).toBe(true);
      expect(tree.getNode('t1').expanded).toBe(true);
      expect(tree.getNode('t1.1').visible).toBe(true);
      expect(tree.getNode('t2').isExpanded()).toBe(true);
      expect(tree.getNode('t2').expanded).toBe(true);
      expect(tree.getNode('t2.1').visible).toBe(true);
    });

    it('expandAll 为 false 时，默认新增节点为收起状态', async () => {
      const tree = new TreeStore({
        expandAll: false,
      });
      tree.append([{
        value: 't1',
        children: [{
          value: 't1.1',
        }],
      }, {
        value: 't2',
        children: [{
          value: 't2.1',
        }],
      }]);

      await delay(0);
      expect(tree.getNode('t1').visible).toBe(true);
      expect(tree.getNode('t1').isExpanded()).toBe(false);
      expect(tree.getNode('t1').expanded).toBe(false);
      expect(tree.getNode('t1.1').visible).toBe(false);
      expect(tree.getNode('t2').visible).toBe(true);
      expect(tree.getNode('t2').isExpanded()).toBe(false);
      expect(tree.getNode('t2').expanded).toBe(false);
      expect(tree.getNode('t2.1').visible).toBe(false);
    });
  });

  describe('treeStore:expandLevel', () => {
    it('append 方法添加多个节点', async () => {
      const tree = new TreeStore();
      tree.append([{
        value: 't5'
      }, {
        value: 't6'
      }]);
    });
  });

  describe('treeStore:expandMutex', () => {
    it('append 方法添加多个节点', async () => {
      const tree = new TreeStore();
      tree.append([{
        value: 't5'
      }, {
        value: 't6'
      }]);
    });
  });

  describe('treeStore:expandParent', () => {
    it('append 方法添加多个节点', async () => {
      const tree = new TreeStore();
      tree.append([{
        value: 't5'
      }, {
        value: 't6'
      }]);
    });
  });

  describe('treeStore:getExpanded', () => {
    it('append 方法添加多个节点', async () => {
      const tree = new TreeStore();
      tree.append([{
        value: 't5'
      }, {
        value: 't6'
      }]);
    });
  });

  describe('treeStore:replaceExpanded', () => {
    it('append 方法添加多个节点', async () => {
      const tree = new TreeStore();
      tree.append([{
        value: 't5'
      }, {
        value: 't6'
      }]);
    });
  });

  describe('treeStore:setExpanded', () => {
    it('append 方法添加多个节点', async () => {
      const tree = new TreeStore();
      tree.append([{
        value: 't5'
      }, {
        value: 't6'
      }]);
    });
  });

  describe('treeStore:setExpandedDirectly', () => {
    it('append 方法添加多个节点', async () => {
      const tree = new TreeStore();
      tree.append([{
        value: 't5'
      }, {
        value: 't6'
      }]);
    });
  });

  describe('treeStore:resetExpanded', () => {
    it('append 方法添加多个节点', async () => {
      const tree = new TreeStore();
      tree.append([{
        value: 't5'
      }, {
        value: 't6'
      }]);
    });
  });

  describe('treeNode:initExpanded', () => {
    it('append 方法添加多个节点', async () => {
      const tree = new TreeStore();
      tree.append([{
        value: 't5'
      }, {
        value: 't6'
      }]);
    });
  });

  describe('treeNode:setExpanded', () => {
    it('append 方法添加多个节点', async () => {
      const tree = new TreeStore();
      tree.append([{
        value: 't5'
      }, {
        value: 't6'
      }]);
    });
  });

  describe('treeNode:toggleExpanded', () => {
    it('append 方法添加多个节点', async () => {
      const tree = new TreeStore();
      tree.append([{
        value: 't5'
      }, {
        value: 't6'
      }]);
    });
  });
});
