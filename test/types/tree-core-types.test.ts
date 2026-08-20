import type { TreeNodeState as TreeNodeStateCurrent } from '../../js/tree/types';
import type { TreeNodeState as TreeNodeStateV1 } from '../../js/tree-v1/types';

declare const currentTreeState: TreeNodeStateCurrent;
declare const v1TreeState: TreeNodeStateV1;

const currentStateFromV1: TreeNodeStateCurrent = v1TreeState;
const v1StateFromCurrent: TreeNodeStateV1 = currentTreeState;

export { currentStateFromV1, v1StateFromCurrent };
