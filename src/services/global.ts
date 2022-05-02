import { OPEN_API_PREFIX } from '@/appConfig';
import type { IAjaxResponseFactory } from '@/data-typings';
import ajax from '@/utils/ajax';

export async function uploadFile(formData: any) {
  return ajax(`/file/upload`, {
    type: 'POST',
    processData: false,
    contentType: false,
    data: formData,
  });
}

/** 上传在线咨询文件 */
export async function uploadChatFile(
  formData: any,
): Promise<IAjaxResponseFactory<{ filePath: string }>> {
  return ajax(`${OPEN_API_PREFIX}/chat-upload`, {
    type: 'POST',
    processData: false,
    contentType: false,
    data: formData,
  });
}
