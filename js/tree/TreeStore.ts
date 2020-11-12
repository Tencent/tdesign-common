import camelCase from 'lodash/camelCase';
import { TreeNode } from './TreeNode';

export interface TreeStoreOptions {
  // 数据字段映射
  keys?: object;
  // 是否展开全部
  expandAll?: boolean;
  // 初始展开级别
  expandLevel?: number;
  // 是否互斥展开(手风琴)
  expandMutex?: boolean;
  // 是否可高亮
  activable?: boolean;
  // 是否可多选高亮
  activeMultiple?: boolean;
  // 是否可选择
  checkable?: boolean;
  // 复选框不联动更新
  checkStrictly?: boolean;
  // 禁用整个树
  disabled?: boolean;
  // 节点加载函数
  load?: Function;
  // 是否延迟加载
  lazy?: boolean;
  // load函数运行后触发
  onLoad?: Function;
  // 节点增删改查后触发
  onReflow?: Function;
  // 节点信息变更后触发
  onUpdate?: Function;
}

// 构建一个树的数据模型
export class TreeStore {
  // 根节点集合
  roots: TreeNode[];
  // 所有节点集合
  nodes: TreeNode[];
  // 所有节点映射
  nodeMap: Map<string, TreeNode>;
  // 配置选项
  config: any;
  // 活动节点
  actived: TreeNode[];
  // 数据被更新的节点集合
  updatedMap: Map<string, boolean>;
  // 选中节点集合
  checkedMap: Map<string, boolean>;
  // 数据更新计时器
  updateTimer: number;
  // 识别是否需要重排
  shouldReflow: boolean;

  constructor(options: TreeStoreOptions) {
    this.config = {
      keys: {},
      expandMutex: false,
      activeMultiple: false,
      checkable: false,
      checkStrictly: false,
      activable: false,
      ...options,
    };
    this.nodes = [];
    this.roots = [];
    this.actived = [];
    this.nodeMap = new Map();
    this.updatedMap = new Map();
    this.checkedMap = new Map();
    // 这个计时器确保频繁的 update 事件被归纳为1次完整数据更新后的触发
    this.updateTimer = null;
    // 在子节点增删改查时，将此属性设置为 true，来触发视图更新
    this.shouldReflow = false;
  }

  // 获取节点对象
  getNode(value: string): TreeNode {
    return this.nodeMap.get(value);
  }

  // 获取节点在总节点列表中的位置
  getIndex(node: TreeNode): number {
    return this.nodes.indexOf(node);
  }

  // 获取所有符合条件的节点
  getNodes(): TreeNode[] {
    return this.nodes;
  }

  // 给树添加节点
  append(list: Array<object>): void {
    list.forEach((item) => {
      const node = new TreeNode(this, item);
      this.roots.push(node);
    });
    this.reflow();
  }

  // 更新树结构
  // 清空 nodes 数组，然后遍历所有根节点重新插入 node
  refreshNodes(): void {
    const {
      roots,
      nodes,
    } = this;
    nodes.length = 0;
    roots.forEach((node) => {
      const list = node.walk();
      Array.prototype.push.apply(nodes, list);
    });
  }

  // 更新所有树节点状态
  refreshState(): void {
    const {
      nodes,
    } = this;
    nodes.forEach((node) => {
      node.update();
    });
  }

  // 节点重排
  reflow(node?: TreeNode): void {
    this.shouldReflow = true;
    this.refreshNodes();
    this.updated(node);
  }

  // 触发更新事件
  updated(node?: TreeNode): void {
    if (node && node.value) {
      this.updatedMap.set(node.value, true);
    }
    if (!this.updateTimer) {
      this.updateTimer = setTimeout(() => {
        clearTimeout(this.updateTimer);
        this.updateTimer = null;
        if (this.shouldReflow) {
          this.shouldReflow = false;
          this.emit('reflow');
        }
        const updatedList = Array.from(this.updatedMap.keys());
        this.updatedMap.clear();
        if (updatedList.length > 0) {
          const updatedNodes = updatedList
            .map(value => this.getNode(value));
          this.emit('update', {
            nodes: updatedNodes,
          });
        }
      });
    }
  }

  // 获取选中态节点 value 数组
  getChecked(map?: Map<string, boolean>): string[] {
    const {
      nodes,
    } = this;
    const list: string[] = [];
    const checkedMap = map || this.checkedMap;
    nodes.forEach((node) => {
      if (node.isChecked(checkedMap)) {
        list.push(node.value);
      }
    });
    return list;
  }

  // 批量设置选中态
  setChecked(list: string[]): void {
    this.reset();
    list.forEach((val: string) => {
      this.checkedMap.set(val, true);
    });
    const checked = this.getChecked();
    const relatedNodes = this.getRelatedNodes(checked);
    relatedNodes.forEach((node) => {
      node.updateChecked();
    });
  }

  // 清除所有选中态
  reset(): void {
    const checked = this.getChecked();
    const relatedNodes = this.getRelatedNodes(checked);
    this.checkedMap.clear();
    relatedNodes.forEach((node) => {
      node.updateChecked();
    });
  }

  // 获取节点状态变化可能影响的周边节点
  getRelatedNodes(list: string[]): TreeNode[] {
    const map = new Map();
    list.forEach((value) => {
      const node = this.getNode(value);
      const parents = node.getParents();
      const children = node.walk();
      const related = parents.concat(children);
      related.forEach((relatedNode) => {
        map.set(relatedNode.value, relatedNode);
      });
    });
    const relatedNodes = Array.from(map.values());
    return relatedNodes;
  }

  // 触发绑定的事件
  emit(name: string, state?: object): void {
    const config = this.config || {};
    const methodName = camelCase(`on-${name}`);
    const method = config[methodName];
    if (typeof method === 'function') {
      method(state);
    }
  }
}
