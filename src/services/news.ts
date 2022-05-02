import type { INewsQueryParams } from '@/data-typings';
import ajax from '@/utils/ajax';
import { OPEN_API_PREFIX } from '@/appConfig';
import { stringify } from 'qs';

/** 获取新闻分页列表 */
export async function queryNews(params: INewsQueryParams) {
  return ajax(`${OPEN_API_PREFIX}/news?${stringify(params)}`);
}

export async function queryNewsDetail({ id }: { id: string }) {
  return ajax(`${OPEN_API_PREFIX}/news/${id}`);
}

export async function createOrUpdateNews(params: any) {
  return ajax(`/news`, {
    type: 'POST',
    data: params,
  });
}

export async function deleteNews({ id }: { id: string }) {
  return ajax(`/news/${id}`, {
    type: 'DELETE',
    data: {},
  });
}
