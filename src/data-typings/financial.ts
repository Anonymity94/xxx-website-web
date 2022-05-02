/** 订单类型 */
export enum EOrderType {
  /** 合同下载 */
  'CONTRACT_DOWNLOAD' = 0,
  /** 律师咨询 */
  'LAWYER_CHAT' = 1,
}

/** 律师财务汇总 */
export interface IFinancialLawyerOrderSummary {
  id: string;
  /** 实际支付金额 */
  total_payed: number;
  /** 律师名称 */
  full_name: string;
}

/** 单个律师财务详情 */
export interface IFinancialLawyerOrderDetail {
  id: string;
  /** 实际支付金额 */
  payed: number;
  /** 律师名称 */
  full_name: string;
  create_time: string;
  end_time: string;
  pay_type: string;
  score: number;
  evaluate?: string;
}

/** 合同财务汇总 */
export interface IFinancialContractOrderSummary {
  id: string;
  name: string;
  /** 实际支付金额 */
  total_payed: number;
  source: number;
  download_count: number;
}

/** 财务订单列表 */
export interface IFinancialOrder {
  id: string;
  /** 实际支付金额 */
  payed: number;
  /** 律师名称 */
  full_name: string;
  // /** 订单类型 */
  // type: EOrderType;
  // /** 交易单号 */
  // tradeNo: string;
  // /** 待支付、已支付（未下载）、已下载 */
  // status: EPayOrderStatus;
  // /** 手机号码 */
  // telephone: string;
  // /** 支付用户ID */
  // userId: string;
  // /** 支付用户角色 */
  // userRole: EUserRole;
  // /** 合同ID */
  // contractId: string;
  // /** 律师ID */
  // lawyerId: string;
  // /** 支付方式：ZFB,WX */
  // payType: EPayType;
  // /** 创建时间 */
  // createTime: string;
  // /** 支付完成时间 */
  // payTime: string;
  // /** 下载文件时间 */
  // downloadTime: string;
  // /** 支付金额 */
  // payment: number;
  // /** 实际支付金额 */
  // payed: number;
}
