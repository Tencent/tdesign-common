import difference from 'lodash/difference';
import camelCase from 'lodash/camelCase';
import TreeNode from './TreeNode';

export type TreeNodeValue = string | TreeNode;

export interface TreeStoreOptions {
  // 数据字段映射
  keys?: any;
  // 是否展开全部
  expandAll?: boolean;
  // 初始展开级别
  expandLevel?: number;
  // 是否互斥展开(手风琴)
  expandMutex?: boolean;
  // 展开子节点时，是否展开父节点
  expandParent?: string | boolean;
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
  // 取值方式，可选值 ['all', 'parentFirst', 'onlyLeaf']
  valueMode?: string;
  // 节点过滤函数
  filter?: Function;
  // load函数运行后触发
  onLoad?: Function;
  // 节点增删改查后触发
  onReflow?: Function;
  // 节点信息变更后触发
  onUpdate?: Function;
  // scoped slots 中转对象
  scopedSlots?: any;
}

export interface TreeNodeProps {
  value?: string;
  label?: string;
  expanded?: boolean;
  expandMutex?: boolean;
  actived?: boolean;
  activable?: boolean;
  checkable?: boolean;
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  draggable?: boolean;
  visible?: boolean;
  loading?: boolean;
}

export interface TreeFilterOptions {
  level?: number;
  filter?: Function;
  props?: TreeNodeProps;
}

function getPara(tree: TreeStore, para: any, item: any) {
  let value = '';
  let node = null;
  let data = null;
  if (typeof para === 'string') {
    value = para;
    data = item;
    node = tree.getNode(value);
  } else if (para instanceof TreeNode) {
    node = para;
    data = item;
  } else {
    data = para;
  }
  const spec = {
    node,
    data,
  };
  return spec;
}

// 构建一个树的数据模型
export class TreeStore {
  // 根节点集合
  children: TreeNode[];
  // 所有节点集合
  nodes: TreeNode[];
  // 所有可见节点集合
  visibleNodes: TreeNode[];
  // 所有节点映射
  nodeMap: Map<string, TreeNode>;
  // 配置选项
  config: any;
  // 活动节点集合
  activedMap: Map<string, boolean>;
  // 数据被更新的节点集合
  updatedMap: Map<string, boolean>;
  // 选中节点集合
  checkedMap: Map<string, boolean>;
  // 展开节点的集合
  expandedMap: Map<string, boolean>;
  // 数据更新计时器
  updateTimer: number;
  // 识别是否需要重排
  shouldReflow: boolean;
  // 过滤器函数
  filter: Function;
  // scoped slots 中转对象
  scopedSlots: any;

  constructor(options: TreeStoreOptions) {
    const config: TreeStoreOptions = {
      keys: {},
      expandAll: false,
      expandMutex: false,
      expandParent: false,
      activeMultiple: false,
      checkable: false,
      checkStrictly: false,
      activable: false,
      valueMode: 'onlyLeaf',
      scopedSlots: null,
      ...options,
    };
    this.config = config;
    this.nodes = [];
    this.visibleNodes = [];
    this.children = [];
    this.nodeMap = new Map();
    this.activedMap = new Map();
    this.expandedMap = new Map();
    this.checkedMap = new Map();
    this.updatedMap = new Map();
    // 这个计时器确保频繁的 update 事件被归纳为1次完整数据更新后的触发
    this.updateTimer = null;
    // 在子节点增删改查时，将此属性设置为 true，来触发视图更新
    this.shouldReflow = false;
    this.scopedSlots = config.scopedSlots;
  }

  // 配置选项
  setConfig(options: TreeStoreOptions) {
    Object.assign(this.config, options);
  }

  // 获取根孩子节点列表
  getChildren() {
    return this.children;
  }

  // 获取节点对象
  getNode(item: TreeNodeValue): TreeNode {
    let node = null;
    if (typeof item === 'string') {
      node = this.nodeMap.get(item);
    } else if (item instanceof TreeNode) {
      node = this.nodeMap.get(item.value);
    }
    return node || null;
  }

  // 获取节点在总节点列表中的位置
  getIndex(node: TreeNode): number {
    return this.nodes.indexOf(node);
  }

  // 获取节点在所有可见节点列表中的位置
  getVisibleIndex(node: TreeNode): number {
    return this.visibleNodes.indexOf(node);
  }

  // 获取指定节点的父节点
  getParent(value: TreeNodeValue): TreeNode {
    let parent = null;
    const node = this.getNode(value);
    if (node) {
      parent = node.getParent();
    }
    return parent;
  }

  // 获取指定节点的所有父节点
  getParents(value: TreeNodeValue): TreeNode[] {
    const node = this.getNode(value);
    let parents: TreeNode[] = [];
    if (node) {
      parents = node.getParents();
    }
    return parents;
  }

  // 获取指定节点在其所在 children 中的位置
  getNodeIndex(value: TreeNodeValue): number {
    const node = this.getNode(value);
    let index = -1;
    if (node) {
      index = node.getIndex();
    }
    return index;
  }

  // 获取所有符合条件的节点
  getNodes(item?: TreeNodeValue, options?: TreeFilterOptions): TreeNode[] {
    let nodes: TreeNode[] = [];
    let val = '';
    if (typeof item === 'string') {
      val = item;
    } else if (item instanceof TreeNode) {
      val = item.value;
    }
    if (!val) {
      nodes = this.nodes.slice(0);
    } else {
      const node = this.getNode(val);
      if (node) {
        nodes = node.walk();
      }
    }

    if (options) {
      const conf: TreeFilterOptions = {
        level: Infinity,
        ...options,
      };
      if (typeof conf.level === 'number' && conf.level !== Infinity) {
        nodes = nodes.filter(node => node.level <= conf.level);
      }
      if (typeof conf.filter === 'function') {
        nodes = nodes.filter(node => conf.filter(node));
      }
      if (typeof conf.props === 'object') {
        nodes = nodes.filter((node) => {
          const result = Object.keys(conf.props).every((key) => {
            const propEqual = node[key] === conf.props[key];
            return propEqual;
          });
          return result;
        });
      }
    }

    return nodes;
  }

  // 给树添加节点数据
  append(list: any[]): void {
    list.forEach((item) => {
      const node = new TreeNode(this, item);
      this.children.push(node);
    });
    this.reflow();
  }

  // 向指定节点追加节点或者数据
  // 支持下列使用方式
  // appendNodes(item)
  // appendNodes(TreeNode)
  // appendNodes(value, item)
  // appendNodes(value, TreeNode)
  // appendNodes(TreeNode, item)
  // appendNodes(TreeNode, TreeNode)
  appendNodes(para?: any, item?: any): void {
    const spec = getPara(this, para, item);
    if (spec.data) {
      if (!spec.node) {
        // 在根节点插入
        if (spec.data instanceof TreeNode) {
          spec.data.appendTo(this);
        } else {
          this.append([spec.data]);
        }
      } else {
        // 插入到目标节点之下
        if (spec.data instanceof TreeNode) {
          spec.data.appendTo(this, spec.node);
        } else {
          spec.node.append([spec.data]);
        }
        spec.node.updateRelated();
      }
    }
  }

  // 在目标节点之前插入节点
  insertBefore(value: TreeNodeValue, item: any): void {
    const node = this.getNode(value);
    if (node) {
      node.insertBefore(item);
    }
  }

  // 在目标节点之后插入节点
  insertAfter(value: TreeNodeValue, item: any): void {
    const node = this.getNode(value);
    if (node) {
      node.insertAfter(item);
    }
  }

  // 更新树结构
  // 清空 nodes 数组，然后遍历所有根节点重新插入 node
  refreshNodes(): void {
    const { children, nodes } = this;
    nodes.length = 0;
    children.forEach((node) => {
      const list = node.walk();
      Array.prototype.push.apply(nodes, list);
    });
  }

  // 更新可见树节点结构
  refreshVisibleNodes(): void {
    this.visibleNodes = this.nodes.filter(node => node.visible);
  }

  // 更新所有树节点状态
  refreshState(): void {
    const { nodes } = this;
    nodes.forEach((node) => {
      node.update();
    });
  }

  // 节点重排
  // 应该仅在树节点增删改查时调用
  reflow(node?: TreeNode): void {
    this.shouldReflow = true;
    this.updated(node);
  }

  // 触发更新事件
  // 节点属性变更时调用
  updated(node?: TreeNode): void {
    if (node && node.value) {
      this.updatedMap.set(node.value, true);
    }
    if (this.updateTimer) return;
    this.updateTimer = setTimeout(() => {
      clearTimeout(this.updateTimer);
      this.updateTimer = null;
      if (this.shouldReflow) {
        this.refreshNodes();
        this.refreshVisibleNodes();
        this.emit('reflow');
      }
      const updatedList = Array.from(this.updatedMap.keys());
      if (updatedList.length > 0) {
        const updatedNodes = updatedList.map(value => this.getNode(value));
        this.emit('update', {
          nodes: updatedNodes,
          map: this.updatedMap,
        });
      } else if (this.shouldReflow) {
        this.emit('update', {
          nodes: [],
          map: this.updatedMap,
        });
      }
      this.shouldReflow = false;
      this.updatedMap.clear();
    });
  }

  // 获取激活节点集合
  getActived(map?: Map<string, boolean>): string[] {
    const activedMap = map || this.activedMap;
    return Array.from(activedMap.keys());
  }

  // 获取指定范围的高亮节点
  getActivedNodes(item?: TreeNodeValue): TreeNode[] {
    let nodes = this.getNodes(item);
    nodes = nodes.filter(node => node.isActived());
    return nodes;
  }

  // 替换激活态
  replaceActived(list: string[]): void {
    this.resetActived();
    this.setActived(list);
  }

  // 设置激活态
  setActived(actived: string[]): void {
    const { activeMultiple } = this.config;
    const list = actived.slice(0);
    if (!activeMultiple) {
      list.length = 1;
    }
    list.forEach((val) => {
      this.activedMap.set(val, true);
      const node = this.getNode(val);
      if (node) {
        node.update();
      }
    });
  }

  // 重置激活态
  resetActived(): void {
    const actived = this.getActived();
    this.activedMap.clear();
    const relatedNodes = this.getRelatedNodes(actived);
    relatedNodes.forEach((node) => {
      node.update();
    });
  }

  // 获取展开节点集合
  getExpanded(map?: Map<string, boolean>): string[] {
    const expandedMap = map || this.expandedMap;
    return Array.from(expandedMap.keys());
  }

  // 替换展开节点
  replaceExpanded(list: string[]): void {
    const expanded = this.getExpanded();
    const added = difference(list, expanded);
    const removed = difference(expanded, list);
    this.setExpandedDirectly(removed, false);
    this.updateExpanded(removed);
    this.setExpanded(added);
  }

  // 批量设置展开节点
  setExpanded(list: string[]): void {
    this.setExpandedDirectly(list);
    this.updateExpanded(list);
  }

  // 直接设置展开节点数据，不更新节点状态
  setExpandedDirectly(list: string[], expanded = true): void {
    list.forEach((val) => {
      if (expanded) {
        this.expandedMap.set(val, true);
        const node = this.getNode(val);
        if (node) {
          node.afterExpanded();
        }
      } else {
        this.expandedMap.delete(val);
      }
    });
  }

  // 清除所有展开节点
  resetExpanded(): void {
    const expanded = this.getExpanded();
    this.expandedMap.clear();
    this.updateExpanded(expanded);
  }

  // 更新展开节点相关节点的状态
  updateExpanded(list: string[]): void {
    const relatedNodes = this.getRelatedNodes(list, {
      withParents: false,
    });
    relatedNodes.forEach((node) => {
      node.update();
    });
    // 更新可见节点集合
    this.refreshVisibleNodes();
  }

  // 获取选中态节点 value 数组
  getChecked(map?: Map<string, boolean>): string[] {
    const { nodes, config } = this;
    const { valueMode, checkStrictly } = config;
    const list: string[] = [];
    const checkedMap = map || this.checkedMap;
    nodes.forEach((node) => {
      if (node.isChecked(checkedMap)) {
        if (valueMode === 'parentFirst' && !checkStrictly) {
          if (!node.parent || !node.parent.isChecked(checkedMap)) {
            list.push(node.value);
          }
        } else if (valueMode === 'onlyLeaf' && !checkStrictly) {
          if (node.isLeaf()) {
            list.push(node.value);
          }
        } else {
          list.push(node.value);
        }
      }
    });
    return list;
  }

  // 获取指定节点下的选中节点
  getCheckedNodes(item?: TreeNodeValue): TreeNode[] {
    let nodes = this.getNodes(item);
    nodes = nodes.filter(node => node.isChecked());
    return nodes;
  }

  // 替换选中态列表
  replaceChecked(list: string[]): void {
    this.resetChecked();
    this.setChecked(list);
  }

  // 批量设置选中态
  setChecked(list: string[]): void {
    const { valueMode, checkStrictly } = this.config;
    list.forEach((val: string) => {
      const node = this.getNode(val);
      if (node) {
        if (valueMode === 'parentFirst' && !checkStrictly) {
          const childrenNodes = node.walk();
          childrenNodes.forEach((childNode) => {
            this.checkedMap.set(childNode.value, true);
          });
        } else {
          this.checkedMap.set(val, true);
          node.update();
        }
      }
    });
    if (!checkStrictly) {
      const checked = this.getChecked();
      const relatedNodes = this.getRelatedNodes(checked);
      relatedNodes.forEach((node) => {
        node.update();
      });
    }
  }

  // 清除所有选中节点
  resetChecked(): void {
    const checked = this.getChecked();
    const relatedNodes = this.getRelatedNodes(checked);
    this.checkedMap.clear();
    relatedNodes.forEach((node) => {
      node.update();
    });
  }

  // 更新全部节点状态
  updateAll(): void {
    const nodes = this.getNodes();
    nodes.forEach((node) => {
      node.update();
    });
  }

  // 移除指定节点
  remove(para?: TreeNodeValue): void {
    const node = this.getNode(para);
    if (node) {
      node.remove();
    }
  }

  // 清空所有节点
  removeAll(): void {
    const nodes = this.getNodes();
    nodes.forEach((node) => {
      node.remove();
    });
  }

  // 获取节点状态变化可能影响的周边节点
  // 实现最小遍历集合
  getRelatedNodes(list: string[], options?: any): TreeNode[] {
    const conf = {
      withParents: true,
      ...options,
    };
    const map = new Map();
    list.forEach((value) => {
      if (map.get(value)) return;
      const node = this.getNode(value);
      if (node) {
        const parents = node.getParents();
        const children = node.walk();
        let related = [];
        if (conf.withParents) {
          related = parents.concat(children);
        } else {
          related = children;
        }
        related.forEach((relatedNode) => {
          map.set(relatedNode.value, relatedNode);
        });
      }
    });
    const relatedNodes = Array.from(map.values());
    return relatedNodes;
  }

  // 触发绑定的事件
  emit(name: string, state?: any): void {
    const config = this.config || {};
    const methodName = camelCase(`on-${name}`);
    const method = config[methodName];
    if (typeof method === 'function') {
      method(state);
    }
  }
}
