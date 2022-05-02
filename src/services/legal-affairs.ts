import { OPEN_API_PREFIX } from '@/appConfig';
import type {
  ILegalAffairsIntroduction,
  ILegalAffairsService,
  IAjaxResponseFactory,
} from '@/data-typings';
import ajax from '@/utils/ajax';
import { stringify } from 'qs';

export async function queryLegalAffairs(params: any) {
  return ajax(`/user/legal-affairs?${stringify(params)}`);
}

export async function queryLegalAffairsDetail({ id }: { id: string }) {
  return ajax(`/user/legal-affairs/${id}`);
}

export async function createOrUpdateLegalAffairs(params: any) {
  return ajax(`/user/legal-affairs`, {
    type: 'POST',
    data: params,
  });
}

export async function deleteLegalAffairs({ id }: { id: string }) {
  return ajax(`/user/legal-affairs/${id}`, {
    type: 'DELETE',
    data: {},
  });
}

/** 查询法务页面内容 */
export async function queryLegalAffairsIntroduction(): Promise<
  IAjaxResponseFactory<ILegalAffairsIntroduction[]>
> {
  return ajax(`${OPEN_API_PREFIX}/legal-affairs/introductions`);
}
/** 编辑法务页面内容 */
export async function updateLegalAffairsIntroduction(
  content: ILegalAffairsIntroduction,
): Promise<IAjaxResponseFactory<any>> {
  return ajax(`/legal-affairs/introductions`, {
    type: 'POST',
    data: content,
  });
}

/** 查询法务服务套餐 */
export async function queryLegalAffairsService(): Promise<
  IAjaxResponseFactory<ILegalAffairsService[]>
> {
  return ajax(`${OPEN_API_PREFIX}/legal-affairs/services`);
}
/** 编辑法务服务套餐 */
export async function createOrUpdateLegalAffairsService(
  params: ILegalAffairsService,
): Promise<IAjaxResponseFactory<any>> {
  return ajax(`/legal-affairs/services`, {
    type: 'POST',
    data: params,
  });
}

export async function queryLegalAffairsServiceDetail({ id }: { id: string }) {
  return ajax(`/legal-affairs/services/${id}`);
}
export async function deleteLegalAffairsService({ id }: { id: string }) {
  return ajax(`/legal-affairs/services/${id}`, {
    type: 'DELETE',
    data: {},
  });
}
