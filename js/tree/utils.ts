import TreeNode from "./tree-node";

export function getPositionValue(parent?: TreeNode, index?: number) {
  // 顶级节点
  if (!parent) {
    return `${index}`;
  }

  const pos =
    typeof parent.children === "boolean" ? 0 : parent.children?.length;
  return `${parent.value}.${index ?? pos}`;
}
