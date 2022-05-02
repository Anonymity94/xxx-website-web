import ajax from '@/utils/ajax';
import { stringify } from 'qs';

export async function queryAdmins(params: any) {
  return ajax(`/user/admins?${stringify(params)}`);
}

export async function queryAdminDetail({ id }: { id: string }) {
  return ajax(`/user/admins/${id}`);
}

export async function createOrUpdateAdmin(params: any) {
  return ajax(`/user/admins`, {
    type: 'POST',
    data: params,
  });
}

export async function deleteAdmin({ id }: { id: string }) {
  return ajax(`/user/admins/${id}`, {
    type: 'DELETE',
    data: {
    },
  });
}
