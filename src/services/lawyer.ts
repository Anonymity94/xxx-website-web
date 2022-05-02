import type { ILawyerQueryParams } from '@/data-typings';
import ajax from '@/utils/ajax';
import { OPEN_API_PREFIX } from '@/appConfig';
import { stringify } from 'qs';

export async function queryLawyers(params: ILawyerQueryParams) {
  return ajax(`${OPEN_API_PREFIX}/user/lawyers?${stringify(params)}`);
}

export async function queryLawyerDetail({ id }: { id: string }) {
  return ajax(`${OPEN_API_PREFIX}/user/lawyers/${id}`);
}

export async function createOrUpdateLawyer(params: any) {
  return ajax(`/user/lawyers`, {
    type: 'POST',
    data: params,
  });
}

export async function updateLawyer(params: any) {
  return ajax(`/user/lawyers`, {
    type: 'PUT',
    data: params,
  });
}

export async function deleteLawyer({ id }: { id: string }) {
  return ajax(`/user/lawyers/${id}`, {
    type: 'DELETE',
    data: {},
  });
}

export interface IEvaluateParams {
  orderId: string;
  evaluate: string;
  score: number;
}
/** 评分 */
export async function evaluateLawyerWork(params: IEvaluateParams) {
  return ajax(`${OPEN_API_PREFIX}/user/lawyers-work`, {
    type: 'POST',
    data: params,
  });
}
