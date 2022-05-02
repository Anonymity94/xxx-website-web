import ajax from '@/utils/ajax';
import { OPEN_API_PREFIX } from '@/appConfig';
import { stringify } from 'qs';

export async function queryCustomerServices(params: any) {
  return ajax(`${OPEN_API_PREFIX}/user/customer-services?${stringify(params)}`);
}

export async function queryCustomerServiceDetail({ id }: { id: string }) {
  return ajax(`/user/customer-services/${id}`);
}

export async function createOrUpdateCustomerService(params: any) {
  return ajax(`/user/customer-services`, {
    type: 'POST',
    data: params,
  });
}

export async function deleteCustomerService({ id }: { id: string }) {
  return ajax(`/user/customer-services/${id}`, {
    type: 'DELETE',
    data: {},
  });
}
