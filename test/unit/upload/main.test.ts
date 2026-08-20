import { describe, expect, it } from 'vitest';
import { handleRequestMethodResponse, handleSuccess } from '../../../js/upload/main';
import type { UploadFile } from '../../../js/upload/types';

describe('upload shared contexts', () => {
  it('returns canonical and legacy success context fields together', () => {
    const event = {} as ProgressEvent;
    const files: UploadFile[] = [{ name: 'example.txt', response: {} }];

    const result = handleSuccess({ event, files, response: { url: '/example.txt' } });

    expect(result.e).toBe(event);
    expect(result.event).toBe(event);
    expect(result.file).toBe(files[0]);
    expect(result.fileList).toBe(files);
    expect(result.currentFiles).toBe(files);
    expect(result.files).toBe(files);
  });

  it('accepts a multi-file custom request response', () => {
    expect(
      handleRequestMethodResponse({
        status: 'success',
        response: { files: [{ name: 'one.txt' }, { name: 'two.txt' }] },
      })
    ).toBe(true);
  });
});
