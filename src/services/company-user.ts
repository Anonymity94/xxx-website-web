import ajax from '@/utils/ajax';
import { OPEN_API_PREFIX } from '@/appConfig';
import { stringify } from 'qs';

export async function queryCompanyUsers(params: any) {
  return ajax(`${OPEN_API_PREFIX}/user/company-users?${stringify(params)}`);
}

export async function queryCompanyUserDetail({ id }: { id: string }) {
  return ajax(`/user/company-users/${id}`);
}

export async function createOrUpdateCompanyUser(params: any) {
  return ajax(`/user/company-users`, {
    type: 'POST',
    data: params,
  });
}

export async function deleteCompanyUser({ id }: { id: string }) {
  return ajax(`/user/company-users/${id}`, {
    type: 'DELETE',
    data: {},
  });
}
