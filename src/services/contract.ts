import { API_PREFIX, OPEN_API_PREFIX } from '@/appConfig';
import type {
  EBoolean,
  EStatus,
  IAjaxResponseFactory,
  IContract,
  IPageFactory,
} from '@/data-typings';
import type { TUserType } from '@/pages/website/AI-ce';
import ajax from '@/utils/ajax';
import $ from 'jquery';
import { stringify } from 'qs';

// 合同
// --------------
export async function queryContracts(params: {
  name?: string;
  size: number;
  page: number;
  status: EStatus;
  /** 是否精确查找 */
  jq?: EBoolean;
  subcategoryId?: string;
  categoryId?: string;
  excludeCategoryId?: string;
  excludeSubcategoryId?: string;
}): Promise<IAjaxResponseFactory<IPageFactory<IContract>>> {
  return ajax(`${OPEN_API_PREFIX}/contract/contracts?${stringify(params)}`);
}

export async function queryContractDetail({ id }: { id: string }) {
  return ajax(`${OPEN_API_PREFIX}/contract/contracts/${id}`);
}

export async function createOrUpdateContract(params: any) {
  return ajax(`/contract/contracts`, {
    type: 'POST',
    data: params,
  });
}

export async function deleteContract({ id }: { id: string }) {
  return ajax(`/contract/contracts/${id}`, {
    type: 'DELETE',
    data: {},
  });
}

// 合同大类
// --------------
export async function queryContractCategories(params: any) {
  return ajax(`${OPEN_API_PREFIX}/contract/categories?${stringify(params)}`);
}

export async function queryContractCategoryDetail({ id }: { id: string }) {
  return ajax(`/contract/categories/${id}`);
}

export async function createOrUpdateContractCategory(params: any) {
  return ajax(`/contract/categories`, {
    type: 'POST',
    data: params,
  });
}

export async function deleteContractCategory({ id }: { id: string }) {
  return ajax(`/contract/categories/${id}`, {
    type: 'DELETE',
    data: {},
  });
}

// 合同小类
// --------------
export async function queryContractSubCategories(params: any) {
  return ajax(`${OPEN_API_PREFIX}/contract/sub-categories?${stringify(params)}`);
}

export async function queryContractSubCategoryDetail({ id }: { id: string }) {
  return ajax(`/contract/sub-categories/${id}`);
}

export async function createOrUpdateContractSubCategory(params: any) {
  return ajax(`/contract/sub-categories`, {
    type: 'POST',
    data: params,
  });
}

export async function deleteContractSubCategory({ id }: { id: string }) {
  return ajax(`/contract/sub-categories/${id}`, {
    type: 'DELETE',
    data: {},
  });
}

/** 付款后的下载 */
export async function downloadContract({ orderId }: { orderId: string }) {
  window.open(`${OPEN_API_PREFIX}/contract/contracts/${orderId}/download`);
}

/** admin下载合同 */
export async function adminDownloadContract(contractId: string) {
  window.open(`${API_PREFIX}/contract/contracts/${contractId}/download`);
}

/** 合同全文检索 */
export async function searchContract(keyword: string): Promise<string> {
  // return ajax(`${OPEN_API_PREFIX}/contract/contracts/search?keyword=${keyword}`);
  return $.ajax(`https://baidu.com/search/search?name=${keyword}`);
}

/** 小策审查：上传合同模版 */
export async function templateUpload(params: any) {
  return ajax(`/check/upload`, {
    type: 'POST',
    data: params,
    processData: false,
    contentType: false,
  });
}

interface IQueryTemplateTypeParams {
  bargainText: string;
}

/** 小策审查：获取合同模版类型 */
export async function queryTemplateType(
  params: IQueryTemplateTypeParams,
): Promise<IAjaxResponseFactory<string>> {
  return ajax(`/check/check`, {
    type: 'POST',
    data: params,
  });
}

export interface IQueryTemplateCheck extends IQueryTemplateTypeParams {
  /** 用户立场 */
  userType?: TUserType;
  /** 文档类型 */
  type?: string;
}
/** 小策审查：合同审查 */
export async function queryTemplateCheck(
  params: IQueryTemplateCheck,
): Promise<IAjaxResponseFactory<string>> {
  return ajax(`/check/check`, {
    type: 'POST',
    data: params,
  });
}

/**
 * 小策审查：下载合同
 * @return 文件名
 */
export async function templateDownload(html: string): Promise<IAjaxResponseFactory<string>> {
  return ajax(`/check/download`, {
    type: 'POST',
    data: {
      bargainText: html,
    },
  });
}
