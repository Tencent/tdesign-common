/** Tree 和 tree-v1 共同使用的框架无关基础类型。 */
export type TreeNodeValue = string | number;

export interface KeysType {
  value?: string;
  label?: string;
  children?: string;
  disabled?: string;
}

export interface TreeNodeState {
  /**
   * 节点是否允许被选中
   * @default false
   */
  checkable?: boolean;
  /**
   * 节点是否被选中
   * @default false
   */
  checked?: boolean;
  /**
   * 节点是否为半选中状态
   * @default false
   */
  indeterminate?: boolean;
  /**
   * 节点是否被禁用
   * @default false
   */
  disabled?: boolean;
  /**
   * 节点是否可拖拽
   * @default false
   */
  draggable?: boolean;
  /**
   * 节点是否可视
   * @default false
   */
  visible?: boolean;
  /**
   * 子节点数据是否在加载中
   * @default false
   */
  loading?: boolean;
  /** 节点值 */
  value?: TreeNodeValue;
  /**
   * 节点标签文案
   * @default ''
   */
  label?: any;
  /**
   * 节点是否已展开
   * @default false
   */
  expanded?: boolean;
  /**
   * 子节点是否互斥展开
   * @default false
   */
  expandMutex?: boolean;
  /**
   * 节点是否被激活
   * @default false
   */
  actived?: boolean;
  /**
   * 节点是否允许被激活
   * @default false
   */
  activable?: boolean;
}

export type TypeValueMode = 'all' | 'parentFirst' | 'onlyLeaf';

export type TypeTimer = ReturnType<typeof setTimeout>;

export interface TypeSettingOptions {
  directly?: boolean;
  isAction?: boolean;
}

export interface TypeRelatedNodesOptions {
  reverse?: boolean;
  withParents?: boolean;
}
