import type { EStatus, IPageParmas } from './index';

/** 普通用户 */
export interface IUser {
  id: string;
  telephone: string;
}

interface IBaseInfo {
  id: string;
  /** 登录名称 */
  loginName: string;
  /** 用户名称 */
  fullName: string;
  /** 密码 */
  password?: string;
  /** 手机号码, */
  telephone: string;
  /** 状态（0：启用，1：禁用） */
  status: EStatus;
  /** 创建时间 */
  createTime: string;
}

export interface ILawyerQueryParams extends IPageParmas {
  status: EStatus;
  fullName?: string;
  company?: string;
  orderStatus?: string;
  goodAt?: string;
  province?: string;
  city?: string;
}

/** 律师 */
export interface ILawyer extends IBaseInfo {
  /** 排序序号 */
  sortNumber: number;
  /** 头像文件地址 */
  avatar: string;
  /** 公司名称 */
  company: string;
  /** 省份 */
  province: string;
  /** 城市 */
  city: string;
  /** 公司具体位置 */
  location: string;
  /** 职称 */
  title: string;
  /** 擅长领域，可以多个值逗号分割，例如：领域A,领域B */
  goodAt: string;
  /** 律师优势，一段描述信息 */
  advantage: string;
  /** 个人简介描述 */
  profile: string;
  /** 接单状态（0：启用，1：禁用） */
  orderStatus: EStatus;
  /** 接单价格/次（0-不限制） */
  orderPrice: string;
  /** 个人档案（富文本） */
  archive: string;
  /** 服务范围描述(富文本) */
  serviceScope: string;

  /** 评价得分（0-5） 从律师服务案例记录（服务次数）计算得来 */
  scoreAvg: number;
  /** 服务次数 从律师服务案例记录（服务次数）计算得来 */
  caseCount: number;
}

/** 企业用户 */
export interface ICompanyUser extends IBaseInfo {
  /** 公司名称 */
  company: string;
  /** 最早有效日期（例如:2021-06-01） */
  earliestDate: string;
  /** 失效日期（例如:2021-06-11） */
  expiryDate: string;
}

/** 客服 */
export type ICustomerService = IBaseInfo;
/** 法务人员表 */
export type ILegalAffairs = IBaseInfo;
/** 管理员 */
export type IAdmin = IBaseInfo;
