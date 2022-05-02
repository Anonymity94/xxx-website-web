import ajax from '@/utils/ajax';
import { stringify } from 'qs';

export async function queryUsers(params: any) {
  return ajax(`/user/users?${stringify(params)}`);
}

export async function queryUserDetail({ id }: { id: string }) {
  return ajax(`/user/users/${id}`);
}

export async function createOrUpdateUser(params: any) {
  return ajax(`/user/users`, {
    type: 'POST',
    data: params,
  });
}

export async function deleteUser({ id }: { id: string }) {
  return ajax(`/user/users/${id}`, {
    type: 'DELETE',
    data: {},
  });
}
