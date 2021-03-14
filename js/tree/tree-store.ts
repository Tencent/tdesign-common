import difference from 'lodash/difference';
import camelCase from 'lodash/camelCase';
import isPlainObject from 'lodash/isPlainObject';
import { TreeNode } from './tree-node';
import {
  TreeNodeValue,
  TypeIdMap,
  TypeTimer,
  TypeTargetNode,
  ITreeNodeData,
  ITreeNodeModel,
  ITreeStoreOptions,
  ITreeFilterOptions,
  IRelatedNodesOptions,
  ITreeEventState,
} from './types';

function parseNodeData(
  tree: TreeStore,
  para: TreeNodeValue | TreeNode | ITreeNodeData,
  item: ITreeNodeData | TreeNode,
) {
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
  public children: TreeNode[];
  // 所有节点集合
  public nodes: TreeNode[];
  // 所有节点映射
  public nodeMap: Map<string, TreeNode>;
  // 配置选项
  public config: ITreeStoreOptions;
  // 活动节点集合
  public activedMap: TypeIdMap;
  // 数据被更新的节点集合
  public updatedMap: TypeIdMap;
  // 选中节点集合
  public checkedMap: TypeIdMap;
  // 展开节点的集合
  public expandedMap: TypeIdMap;
  // 符合过滤条件的节点的集合
  public filterMap: TypeIdMap;
  // 数据更新计时器
  public updateTimer: TypeTimer;
  // 过滤数据更新计时器
  public filterUpdateTimer: TypeTimer;
  // 识别是否需要重排
  public shouldReflow: boolean;
  // 过滤器函数
  public filter: Function;

  public constructor(options: ITreeStoreOptions) {
    const config: ITreeStoreOptions = {
      keys: {},
      expandAll: false,
      expandMutex: false,
      expandParent: false,
      activeMultiple: false,
      checkable: false,
      checkStrictly: false,
      activable: false,
      valueMode: 'onlyLeaf',
      ...options,
    };
    this.config = config;
    this.nodes = [];
    this.children = [];
    this.nodeMap = new Map();
    this.activedMap = new Map();
    this.expandedMap = new Map();
    this.checkedMap = new Map();
    this.updatedMap = new Map();
    this.filterMap = new Map();
    // 这个计时器确保频繁的 update 事件被归纳为1次完整数据更新后的触发
    this.updateTimer = null;
    this.filterUpdateTimer = null;
    // 在子节点增删改查时，将此属性设置为 true，来触发视图更新
    this.shouldReflow = false;
  }

  // 配置选项
  public setConfig(options: ITreeStoreOptions) {
    Object.assign(this.config, options);
  }

  // 获取根孩子节点列表
  public getChildren() {
    return this.children;
  }

  // 获取节点对象
  public getNode(item: TypeTargetNode): TreeNode {
    let node = null;
    if (typeof item === 'string') {
      node = this.nodeMap.get(item);
    } else if (item instanceof TreeNode) {
      node = this.nodeMap.get(item.value);
    }
    return node || null;
  }

  // 获取节点在总节点列表中的位置
  public getIndex(node: TreeNode): number {
    return this.nodes.indexOf(node);
  }

  // 获取指定节点的父节点
  public getParent(value: TreeNodeValue): TreeNode {
    let parent = null;
    const node = this.getNode(value);
    if (node) {
      parent = node.getParent();
    }
    return parent;
  }

  // 获取指定节点的所有父节点
  public getParents(value: TreeNodeValue): TreeNode[] {
    const node = this.getNode(value);
    let parents: TreeNode[] = [];
    if (node) {
      parents = node.getParents();
    }
    return parents;
  }

  // 获取指定节点在其所在 children 中的位置
  public getNodeIndex(value: TreeNodeValue): number {
    const node = this.getNode(value);
    let index = -1;
    if (node) {
      index = node.getIndex();
    }
    return index;
  }

  // 获取所有符合条件的节点
  public getNodes(
    item?: TypeTargetNode,
    options?: ITreeFilterOptions,
  ): TreeNode[] {
    let nodes: TreeNode[] = [];
    let val: TreeNodeValue = '';
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
      const conf: ITreeFilterOptions = {
        level: Infinity,
        ...options,
      };
      if (typeof conf.level === 'number' && conf.level !== Infinity) {
        nodes = nodes.filter(node => node.level <= conf.level);
      }
      if (typeof conf.filter === 'function') {
        nodes = nodes.filter((node) => {
          const nodeModel = node.getTreeNodeModel();
          return conf.filter(nodeModel);
        });
      }
      if (isPlainObject(conf.props)) {
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
  public append(list: ITreeNodeData[]): void {
    list.forEach((item) => {
      const node = new TreeNode(this, item);
      this.children.push(node);
    });
    this.reflow();
  }

  /**
   * 向指定节点追加节点或者数据
   * 支持下列使用方式
   * appendNodes(item)
   * appendNodes(TreeNode)
   * appendNodes(value, item)
   * appendNodes(value, TreeNode)
   * appendNodes(TreeNode, item)
   * appendNodes(TreeNode, TreeNode)
   */
  public appendNodes(
    para?: TreeNodeValue | TreeNode | ITreeNodeData,
    item?: ITreeNodeData | TreeNode,
  ): void {
    const spec = parseNodeData(this, para, item);
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
  public insertBefore(value: TreeNodeValue, item: ITreeNodeData): void {
    const node = this.getNode(value);
    if (node) {
      node.insertBefore(item);
    }
  }

  // 在目标节点之后插入节点
  public insertAfter(value: TreeNodeValue, item: ITreeNodeData): void {
    const node = this.getNode(value);
    if (node) {
      node.insertAfter(item);
    }
  }

  // 更新树结构
  // 清空 nodes 数组，然后遍历所有根节点重新插入 node
  public refreshNodes(): void {
    const { children, nodes } = this;
    nodes.length = 0;
    children.forEach((node) => {
      const list = node.walk();
      Array.prototype.push.apply(nodes, list);
    });
  }

  // 更新所有树节点状态
  public refreshState(): void {
    const { nodes } = this;
    nodes.forEach((node) => {
      node.update();
    });
  }

  // 节点重排
  // 应该仅在树节点增删改查时调用
  public reflow(node?: TreeNode): void {
    this.shouldReflow = true;
    this.updated(node);
  }

  // 触发更新事件
  // 节点属性变更时调用
  public updated(node?: TreeNode): void {
    if (node?.value) {
      this.updatedMap.set(node.value, true);
    }
    if (this.updateTimer) return;
    this.updateTimer = setTimeout(() => {
      clearTimeout(this.updateTimer);
      this.updateTimer = null;
      if (this.shouldReflow) {
        this.refreshNodes();
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
  public getActived(map?: TypeIdMap): TreeNodeValue[] {
    const activedMap = map || this.activedMap;
    return Array.from(activedMap.keys());
  }

  // 获取指定范围的高亮节点
  public getActivedNodes(item?: TypeTargetNode): TreeNode[] {
    let nodes = this.getNodes(item);
    nodes = nodes.filter(node => node.isActived());
    return nodes;
  }

  // 替换激活态
  public replaceActived(list: TreeNodeValue[]): void {
    this.resetActived();
    this.setActived(list);
  }

  // 设置激活态
  public setActived(actived: TreeNodeValue[]): void {
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
  public resetActived(): void {
    const actived = this.getActived();
    this.activedMap.clear();
    const relatedNodes = this.getRelatedNodes(actived);
    relatedNodes.forEach((node) => {
      node.update();
    });
  }

  // 获取展开节点集合
  public getExpanded(map?: TypeIdMap): TreeNodeValue[] {
    const expandedMap = map || this.expandedMap;
    return Array.from(expandedMap.keys());
  }

  // 替换展开节点
  public replaceExpanded(list: TreeNodeValue[]): void {
    const expanded = this.getExpanded();
    const added = difference(list, expanded);
    const removed = difference(expanded, list);
    this.setExpandedDirectly(removed, false);
    this.updateExpanded(removed);
    this.setExpanded(added);
  }

  // 批量设置展开节点
  public setExpanded(list: TreeNodeValue[]): void {
    this.setExpandedDirectly(list);
    this.updateExpanded(list);
  }

  // 直接设置展开节点数据，不更新节点状态
  public setExpandedDirectly(list: TreeNodeValue[], expanded = true): void {
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
  public resetExpanded(): void {
    const expanded = this.getExpanded();
    this.expandedMap.clear();
    this.updateExpanded(expanded);
  }

  // 更新展开节点相关节点的状态
  public updateExpanded(list: TreeNodeValue[]): void {
    const relatedNodes = this.getRelatedNodes(list, {
      withParents: false,
    });
    relatedNodes.forEach((node) => {
      node.update();
    });
  }

  // 获取选中态节点 value 数组
  public getChecked(map?: TypeIdMap): TreeNodeValue[] {
    const { nodes, config } = this;
    const { valueMode, checkStrictly } = config;
    const list: TreeNodeValue[] = [];
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
  public getCheckedNodes(item?: TypeTargetNode): TreeNode[] {
    let nodes = this.getNodes(item);
    nodes = nodes.filter(node => node.isChecked());
    return nodes;
  }

  // 替换选中态列表
  public replaceChecked(list: TreeNodeValue[]): void {
    this.resetChecked();
    this.setChecked(list);
  }

  // 批量设置选中态
  public setChecked(list: TreeNodeValue[]): void {
    const { valueMode, checkStrictly } = this.config;
    list.forEach((val: TreeNodeValue) => {
      const node = this.getNode(val);
      if (node) {
        if (valueMode === 'parentFirst' && !checkStrictly) {
          const childrenNodes = node.walk();
          childrenNodes.forEach((childNode) => {
            this.checkedMap.set(childNode.value, true);
          });
        } else {
          this.checkedMap.set(val, true);
          node.updateChecked();
        }
      }
    });
    if (!checkStrictly) {
      const checked = this.getChecked();
      const relatedNodes = this.getRelatedNodes(checked);
      relatedNodes.forEach((node) => {
        node.updateChecked();
      });
    }
  }

  // 清除所有选中节点
  public resetChecked(): void {
    const checked = this.getChecked();
    const relatedNodes = this.getRelatedNodes(checked);
    this.checkedMap.clear();
    relatedNodes.forEach((node) => {
      node.updateChecked();
    });
  }

  // 更新全部节点状态
  public updateAll(): void {
    const nodes = this.getNodes();
    nodes.forEach((node) => {
      node.update();
    });
  }

  // 移除指定节点
  public remove(para?: TreeNodeValue): void {
    const node = this.getNode(para);
    if (node) {
      node.remove();
    }
  }

  // 清空所有节点
  public removeAll(): void {
    const nodes = this.getNodes();
    nodes.forEach((node) => {
      node.remove();
    });
  }

  // 获取节点状态变化可能影响的周边节点
  // 实现最小遍历集合
  public getRelatedNodes(
    list: TreeNodeValue[],
    options?: IRelatedNodesOptions,
  ): TreeNode[] {
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
  public emit(name: string, state?: ITreeEventState): void {
    const config = this.config || {};
    const methodName = camelCase(`on-${name}`);
    const method = config[methodName];
    if (typeof method === 'function') {
      method(state);
    }
  }

  public updateFilterNodes() {
    if (this.filterUpdateTimer) {
      return;
    }
    this.filterUpdateTimer = setTimeout(() => {
      this.filterUpdateTimer = null;
      const filterNodeKeys = [...this.filterMap.keys()];
      // 存放所有符合过滤条件的节点的各级父节点
      const filterNodeParentsMap = new Map();
      const onlyFilterRoot = filterNodeKeys.every((value: TreeNodeValue) => {
        const node = this.getNode(value);
        return !node || !node.getParent();
      });
      const allNodes = this.getNodes();
      // 当 filterMap 中，只有根节点时，重置所有节点的状态
      if (onlyFilterRoot) {
        allNodes.forEach((item: TreeNode) => {
          const node = item;
          node.disabled = false;
        });
      } else {
        filterNodeKeys.forEach((value: TreeNodeValue) => {
          const node = this.getNode(value);
          if (!node) {
            return;
          }
          const parents = node.getParents();
          // 处理符合过滤条件的节点的各级父节点
          parents.forEach((node: TreeNode) => {
            // 父节点不符合过滤条件，才放入 filterNodeParentsMap
            if (
              !this.filterMap.get(node.value)
              && !filterNodeParentsMap.get(node.value)
            ) {
              filterNodeParentsMap.set(node.value, node);
            }
          });
        });
        allNodes.forEach((item: TreeNode) => {
          const node = item;
          if (filterNodeParentsMap.get(node.value)) {
            // 符合过滤条件的节点、的各级父节点（路径节点），显示、并 disabled
            node.visible = true;
            node.expanded = true;
            node.disabled = true;
          } else if (!this.filterMap.get(node.value) && node.visible) {
            // 不符合过滤条件的、过滤之前已经手动展开的节点，disabled
            node.disabled = true;
          } else {
            node.disabled = false;
          }
        });
      }
    });
  }
}

export default TreeStore;
