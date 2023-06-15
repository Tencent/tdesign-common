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

      tree.appendNodes('t1.1', {
        value: 't1.1.1',
      });
      await delay(0);
      expect(tree.getNode('t1.1').expanded).toBe(true);
      expect(tree.getNode('t1.1.1').visible).toBe(true);
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

      tree.appendNodes('t1.1', {
        value: 't1.1.1',
      });
      await delay(0);
      expect(tree.getNode('t1.1').expanded).toBe(false);
      expect(tree.getNode('t1.1.1').visible).toBe(false);
    });
  });

  describe('treeStore:expandLevel', () => {
    it('expandLevel 指定默认展开层级', async () => {
      const tree = new TreeStore({
        expandLevel: 1,
      });
      tree.append([{
        value: 't1',
        children: [{
          value: 't1.1',
          children: [{
            value: 't1.1.1',
          }],
        }],
      }, {
        value: 't2',
        children: [{
          value: 't2.1',
          children: [{
            value: 't2.1.1',
          }],
        }],
      }]);

      await delay(0);
      expect(tree.getNode('t1').expanded).toBe(true);
      expect(tree.getNode('t1.1').visible).toBe(true);
      expect(tree.getNode('t1.1').expanded).toBe(false);
      expect(tree.getNode('t1.1.1').expanded).toBe(false);
      expect(tree.getNode('t1.1.1').visible).toBe(false);
      expect(tree.getNode('t2').expanded).toBe(true);
      expect(tree.getNode('t2.1').visible).toBe(true);
      expect(tree.getNode('t2.1').expanded).toBe(false);
      expect(tree.getNode('t2.1.1').expanded).toBe(false);
      expect(tree.getNode('t2.1.1').visible).toBe(false);

      tree.appendNodes([{
        value: 't3',
        children: [{
          value: 't3.1',
          children: [{
            value: 't3.1.1',
          }],
        }],
      }]);
      await delay(0);
      expect(tree.getNode('t3').expanded).toBe(true);
      expect(tree.getNode('t3.1').visible).toBe(true);
      expect(tree.getNode('t3.1').expanded).toBe(false);
      expect(tree.getNode('t3.1.1').expanded).toBe(false);
      expect(tree.getNode('t3.1.1').visible).toBe(false);
    });
  });

  describe('treeStore:expandMutex', () => {
    it('默认 expandMutex 为 false, 展开状态互不影响', async () => {
      const tree = new TreeStore();
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
      expect(tree.getNode('t1').expanded).toBe(false);
      expect(tree.getNode('t1.1').visible).toBe(false);
      expect(tree.getNode('t2').expanded).toBe(false);
      expect(tree.getNode('t2.1').visible).toBe(false);

      tree.getNode('t1').setExpanded(true, {
        directly: true,
      });
      await delay(0);
      expect(tree.getNode('t1').expanded).toBe(true);
      expect(tree.getNode('t1.1').visible).toBe(true);
      expect(tree.getNode('t2').expanded).toBe(false);
      expect(tree.getNode('t2.1').visible).toBe(false);

      tree.getNode('t2').setExpanded(true, {
        directly: true,
      });
      await delay(0);
      expect(tree.getNode('t1').expanded).toBe(true);
      expect(tree.getNode('t1.1').visible).toBe(true);
      expect(tree.getNode('t2').expanded).toBe(true);
      expect(tree.getNode('t2.1').visible).toBe(true);
    });

    it('expandMutex 为 true, 同级展开状态互斥', async () => {
      const tree = new TreeStore({
        expandMutex: true,
      });
      tree.append([{
        value: 't1',
        children: [{
          value: 't1.1',
          children: [{
            value: 't1.1.1',
          }],
        }, {
          value: 't1.2',
          children: [{
            value: 't1.2.1',
          }],
        }],
      }, {
        value: 't2',
        children: [{
          value: 't2.1',
        }],
      }]);

      await delay(0);
      expect(tree.getNode('t1').expanded).toBe(false);
      expect(tree.getNode('t1.1').visible).toBe(false);
      expect(tree.getNode('t1.1').expanded).toBe(false);
      expect(tree.getNode('t1.1.1').visible).toBe(false);
      expect(tree.getNode('t1.2').expanded).toBe(false);
      expect(tree.getNode('t1.2.1').visible).toBe(false);
      expect(tree.getNode('t2').expanded).toBe(false);
      expect(tree.getNode('t2.1').visible).toBe(false);

      tree.getNode('t2').setExpanded(true, {
        directly: true,
      });
      await delay(0);
      expect(tree.getNode('t1').expanded).toBe(false);
      expect(tree.getNode('t1.1').visible).toBe(false);
      expect(tree.getNode('t1.1').expanded).toBe(false);
      expect(tree.getNode('t1.1.1').visible).toBe(false);
      expect(tree.getNode('t1.2').expanded).toBe(false);
      expect(tree.getNode('t1.2.1').visible).toBe(false);
      expect(tree.getNode('t2').expanded).toBe(true);
      expect(tree.getNode('t2.1').visible).toBe(true);

      tree.getNode('t1').setExpanded(true, {
        directly: true,
      });
      await delay(0);
      expect(tree.getNode('t1').expanded).toBe(true);
      expect(tree.getNode('t1.1').visible).toBe(true);
      expect(tree.getNode('t1.1').expanded).toBe(false);
      expect(tree.getNode('t1.1.1').visible).toBe(false);
      expect(tree.getNode('t1.2').expanded).toBe(false);
      expect(tree.getNode('t1.2.1').visible).toBe(false);
      expect(tree.getNode('t2').expanded).toBe(false);
      expect(tree.getNode('t2.1').visible).toBe(false);

      tree.getNode('t1.1').setExpanded(true, {
        directly: true,
      });
      await delay(0);
      expect(tree.getNode('t1').expanded).toBe(true);
      expect(tree.getNode('t1.1').visible).toBe(true);
      expect(tree.getNode('t1.1').expanded).toBe(true);
      expect(tree.getNode('t1.1.1').visible).toBe(true);
      expect(tree.getNode('t1.2').expanded).toBe(false);
      expect(tree.getNode('t1.2.1').visible).toBe(false);
      expect(tree.getNode('t2').expanded).toBe(false);
      expect(tree.getNode('t2.1').visible).toBe(false);

      tree.getNode('t1.2').setExpanded(true, {
        directly: true,
      });
      await delay(0);
      expect(tree.getNode('t1').expanded).toBe(true);
      expect(tree.getNode('t1.1').visible).toBe(true);
      expect(tree.getNode('t1.1').expanded).toBe(false);
      expect(tree.getNode('t1.1.1').visible).toBe(false);
      expect(tree.getNode('t1.2').expanded).toBe(true);
      expect(tree.getNode('t1.2.1').visible).toBe(true);
      expect(tree.getNode('t2').expanded).toBe(false);
      expect(tree.getNode('t2.1').visible).toBe(false);
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

  describe('treeStore:getExpanded()', () => {
    it('append 方法添加多个节点', async () => {
      const tree = new TreeStore();
      tree.append([{
        value: 't5'
      }, {
        value: 't6'
      }]);
    });
  });

  describe('treeStore:replaceExpanded()', () => {
    it('append 方法添加多个节点', async () => {
      const tree = new TreeStore();
      tree.append([{
        value: 't5'
      }, {
        value: 't6'
      }]);
    });
  });

  describe('treeStore:setExpanded()', () => {
    it('setExpanded 方法调用会忽略互斥属性', async () => {
      const tree = new TreeStore({
        expandMutex: true,
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

      tree.setExpanded(['t1']);
      tree.setExpanded(['t2']);
      await delay(0);
      expect(tree.getNode('t1.1').visible).toBe(true);
      expect(tree.getNode('t2.1').visible).toBe(true);
    });

    it('setExpanded 方法批量设置展开节点', async () => {
      const tree = new TreeStore({
        expandMutex: true,
      });
      tree.append([{
        value: 't1',
        children: [{
          value: 't1.1',
          children: [{
            value: 't1.1.1',
          }],
        }, {
          value: 't1.2',
          children: [{
            value: 't1.2.1',
          }],
        }],
      }, {
        value: 't2',
        children: [{
          value: 't2.1',
        }],
      }]);

      await delay(0);

      tree.setExpanded(['t1', 't2', 't1.2']);
      await delay(0);
      expect(tree.getNode('t1').expanded).toBe(true);
      expect(tree.getNode('t1.1').visible).toBe(true);
      expect(tree.getNode('t1.1').expanded).toBe(false);
      expect(tree.getNode('t1.1.1').visible).toBe(false);
      expect(tree.getNode('t1.2').expanded).toBe(true);
      expect(tree.getNode('t1.2.1').visible).toBe(true);
      expect(tree.getNode('t2').expanded).toBe(true);
      expect(tree.getNode('t2.1').visible).toBe(true);
    });
  });

  describe('treeStore:setExpandedDirectly()', () => {
    it('setExpandedDirectly 方法批量设置节点展开状态', async () => {
      const tree = new TreeStore({
        expandMutex: true,
      });
      tree.append([{
        value: 't1',
        children: [{
          value: 't1.1',
          children: [{
            value: 't1.1.1',
          }],
        }, {
          value: 't1.2',
          children: [{
            value: 't1.2.1',
          }],
        }],
      }, {
        value: 't2',
        children: [{
          value: 't2.1',
        }],
      }]);

      await delay(0);

      tree.setExpandedDirectly(['t1', 't2', 't1.2'], true);
      await delay(0);
      expect(tree.getNode('t1').expanded).toBe(true);
      expect(tree.getNode('t1.1').visible).toBe(true);
      expect(tree.getNode('t1.1').expanded).toBe(false);
      expect(tree.getNode('t1.1.1').visible).toBe(false);
      expect(tree.getNode('t1.2').expanded).toBe(true);
      expect(tree.getNode('t1.2.1').visible).toBe(true);
      expect(tree.getNode('t2').expanded).toBe(true);
      expect(tree.getNode('t2.1').visible).toBe(true);

      tree.setExpandedDirectly(['t1', 't2'], false);
      await delay(0);
      expect(tree.getNode('t1').expanded).toBe(false);
      expect(tree.getNode('t1.1').visible).toBe(false);
      expect(tree.getNode('t1.1').expanded).toBe(false);
      expect(tree.getNode('t1.1.1').visible).toBe(false);
      expect(tree.getNode('t1.2').expanded).toBe(true);
      expect(tree.getNode('t1.2.1').visible).toBe(false);
      expect(tree.getNode('t2').expanded).toBe(false);
      expect(tree.getNode('t2.1').visible).toBe(false);
    });
  });

  describe('treeStore:resetExpanded()', () => {
    it('append 方法添加多个节点', async () => {
      const tree = new TreeStore();
      tree.append([{
        value: 't5'
      }, {
        value: 't6'
      }]);
    });
  });

  describe('treeNode:initExpanded()', () => {
    it('append 方法添加多个节点', async () => {
      const tree = new TreeStore();
      tree.append([{
        value: 't5'
      }, {
        value: 't6'
      }]);
    });
  });

  describe('treeNode:setExpanded()', () => {
    it('append 方法添加多个节点', async () => {
      const tree = new TreeStore();
      tree.append([{
        value: 't5'
      }, {
        value: 't6'
      }]);
    });
  });

  describe('treeNode:toggleExpanded()', () => {
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
