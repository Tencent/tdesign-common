import { TreeOptionData } from '../common';

type TargetValue = string | number | object;

/**
 * 递归查找指定节点的所有父节点的 value
 * @param options 树形数据
 * @param targetValue 目标节点的 value
 * @param realChildren 子节点的 key (别名)
 * @param realValue 节点的 value 的 key (别名)
 */
export function findParentValues(
  options: TreeOptionData[],
  targetValue: TargetValue,
  realValue: string,
  realChildren: string,
): (TargetValue)[] {
  let currentTargetValue = targetValue;
  if (currentTargetValue != null && typeof currentTargetValue === 'object') {
    currentTargetValue = (currentTargetValue as { [key: string]: string | number })?.[realValue];
  }
  if (currentTargetValue == null) return [];

  function findPath(nodes: TreeOptionData[], parentPath: (TargetValue)[]): (TargetValue)[] | null {
    let result: (TargetValue)[] | null = null;
    nodes.some((node) => {
      const newPath = [...parentPath, node[realValue]];
      if (node[realValue] === currentTargetValue) {
        result = parentPath;
        return true;
      }
      if (Array.isArray(node[realChildren]) && node[realChildren].length) {
        result = findPath(node[realChildren], newPath);
        if (result !== null) {
          return true;
        }
      }
      return false;
    });
    return result;
  }

  return findPath(options, []) || [];
}
