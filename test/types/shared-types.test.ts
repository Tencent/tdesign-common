import type {
  ProgressContext,
  RequestMethodResponse,
  SuccessContext,
  UploadFile,
  UploadRemoveContext,
} from '../../js/upload/types';
import type { DisableDateObj } from '../../js/date-picker/utils';
import type { TreeNodeState as TreeNodeStateCurrent } from '../../js/tree/types';
import type { TreeNodeState as TreeNodeStateV1 } from '../../js/tree-v1/types';

interface CustomUploadFile extends UploadFile {
  id: string;
}

declare const requestResponse: RequestMethodResponse<CustomUploadFile>;
declare const progressContext: ProgressContext<CustomUploadFile>;
declare const successContext: SuccessContext<CustomUploadFile>;
declare const removeContext: UploadRemoveContext<CustomUploadFile, PointerEvent>;
declare const currentTreeState: TreeNodeStateCurrent;
declare const v1TreeState: TreeNodeStateV1;

const requestFiles: CustomUploadFile[] | undefined = requestResponse.response.files;
const progressFiles: CustomUploadFile[] | undefined = progressContext.currentFiles;
const successFiles: CustomUploadFile[] | undefined = successContext.currentFiles;
const removeEvent: PointerEvent | undefined = removeContext.e;
const currentStateFromV1: TreeNodeStateCurrent = v1TreeState;
const v1StateFromCurrent: TreeNodeStateV1 = currentTreeState;

const disableDate: DisableDateObj = {
  before: new Date(),
  after: Date.now(),
  from: '2026-01-01',
};

export { currentStateFromV1, disableDate, progressFiles, removeEvent, requestFiles, successFiles, v1StateFromCurrent };
