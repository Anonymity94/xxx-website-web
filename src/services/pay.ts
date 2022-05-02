// 合同扫码支付
// --------------

import { OPEN_API_PREFIX } from '@/appConfig';
import type {
  EPayOrderStatus,
  EPayType,
  EUserRole,
  IPayOrder,
  IAjaxResponseFactory,
} from '@/data-typings';
import ajax from '@/utils/ajax';
import { stringify } from 'qs';

/** 获取合同付款二维码 */
export async function queryContractOrder({
  contractId,
  payType,
}: {
  contractId: string;
  payType: EPayType;
}): Promise<IAjaxResponseFactory<IPayOrder>> {
  return ajax(`${OPEN_API_PREFIX}/contract/contracts/${contractId}/pay-qrcode?payType=${payType}`);
}

/** 根据订单ID获取订单状态 */
export async function queryOrderStatus({
  orderId,
}: {
  orderId: string;
}): Promise<IAjaxResponseFactory<EPayOrderStatus>> {
  return ajax(`${OPEN_API_PREFIX}/order/${orderId}/status`);
}

/** 查询某个人未使用的聊天订单 */
export async function queryChatOrderUnused(params: {
  userId: string | number;
  userRole: EUserRole;
  lawyerId: string | number;
}): Promise<IAjaxResponseFactory<{ id: string; status: EPayOrderStatus }>> {
  return ajax(`${OPEN_API_PREFIX}/order/unused?${stringify(params)}`);
}

/** 获取律师聊天付款二维码 */
export async function queryLawyerChatOrder({
  lawyerId,
  payType,
  userId,
  userRole,
}: {
  payType: EPayType;
  lawyerId: string;
  userId: string;
  userRole: EUserRole;
}): Promise<IAjaxResponseFactory<IPayOrder>> {
  return ajax(
    `${OPEN_API_PREFIX}/user/lawyers/${lawyerId}/pay-qrcode?payType=${payType}&userId=${userId}&userRole=${userRole}`,
  );
}

/** 完成律师聊天 */
export async function finishedLawyerChat({
  orderId,
}: {
  orderId: string;
}): Promise<IAjaxResponseFactory<any>> {
  return ajax(`${OPEN_API_PREFIX}/user/lawyers/${orderId}/chated`, {
    type: 'POST',
  });
}

export async function queryBuyLegalAffairsServiceOrder({
  serviceId,
  payType,
}: {
  serviceId: string;
  payType: EPayType;
}): Promise<IAjaxResponseFactory<IPayOrder>> {
  return ajax(
    `${OPEN_API_PREFIX}/legal-affairs/services/${serviceId}/pay-qrcode?payType=${payType}`,
  );
}
