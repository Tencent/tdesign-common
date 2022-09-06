import TreeNode from "./tree-node";

/**
 * 尝试使用节点在树中的位置作为 value
 * @param parent
 * @param index
 * @returns
 */
export function getPositionValue(parent?: TreeNode, index?: number) {
  // 顶级节点
  if (!parent) {
    return `${index}`;
  }

  const pos =
    typeof parent.children === "boolean" ? 0 : parent.children?.length;
  return `${parent.value}.${index ?? pos}`;
}
