/** 法务服务套餐 */
export interface ILegalAffairsService {
  id: string;
  /** 订单编号前缀 */
  prefix: string;
  /** 套餐名称 */
  name: string;
  /** 套餐价格 */
  price: number;
  description?: string;
}

/** 法务简介 */
export interface ILegalAffairsIntroduction {
  id: string;
  introduction: string;
}
