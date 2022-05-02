/** 合同下载订单信息 */
export interface IPayOrder {
  /** 200表示正常， 400是有错误了 */
  status: '200' | '400';
  /** 订单ID */
  orderId: string;
  /** 付款二维码 base64 */
  image: string;
  /** 金额 */
  price: number;
  /** 错误信息 */
  msg?: string;
}

export enum EPayType {
  AliPay = 'ZFB',
  WeiXinPay = 'WX',
}

export const EPayTypeText = {
  [EPayType.AliPay]: '支付宝',
  [EPayType.WeiXinPay]: '微信',
};
/** 订单支付状态 */
export enum EPayOrderStatus {
  /** 欠费的 */
  'Arrearage' = '待支付',
  /** 已支付 */
  'Account_Paid' = '已支付',
  /** 已使用 */
  'Used' = '已使用',
}
