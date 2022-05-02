/** 人员状态 */
export enum EStatus {
  /** 启用 */
  'Open' = 0,
  /** 禁用 */
  'Closed' = 1,
}

export enum EBoolean {
  'True' = 1,
  'False' = 0,
}

/** 分页封装器 */
export interface IPageFactory<T> {
  /** 当前页数 */
  number: number;
  /** 每页记录数 */
  size: number;
  /** 总页数 */
  totalPages: number;
  /** 总条数 */
  totalElements: number;
  content: T[];
}

/** ajax 封装好的返回值 */
export interface IAjaxResponseFactory<T> {
  status?: number;
  success: boolean;
  result: T;
}

/**  */
export interface IRecommendResource<T> {
  success: boolean;
  data: T;
  page: number;
  total: number;
}

/** 分页查询参数 */
export interface IPageParmas {
  /**
   * pageNumber
   * @description 第一页从 0 开始
   */
  page: number;
  /** pageSize */
  size: number;
  /** 排序字段，不需要的话就是创建时间倒序 */
  sort: string;
}

/** 用户角色 */
export enum EUserRole {
  /** 普通用户 */
  'USER' = 'user',
  /** 律师 */
  'LAWYER' = 'lawyer',
  /** 法务人员  */
  'LEGAL_AFFAIRS' = 'legal_affairs',
  /** 客服人员 */
  'CUSTOMER_SERVICE' = 'customer_service',
  /** 企业用户 */
  'COMPANY_USER' = 'company_user',
  /** 管理员 */
  'ADMIN' = 'admin',
  /** 系统消息 */
  'SYSTEM' = 'system',
}

/** 角色 */
export const USER_ROLE_LABEL_MAP = {
  [EUserRole.USER]: '普通用户',
  [EUserRole.LAWYER]: '律师',
  [EUserRole.LEGAL_AFFAIRS]: '法务',
  [EUserRole.CUSTOMER_SERVICE]: '客服',
  [EUserRole.COMPANY_USER]: '企业用户',
  [EUserRole.ADMIN]: '系统管理员',
};

export interface ICurrentUser {
  id: string;
  role: EUserRole;
  loginName: string;
  login_name: string;
  fullName: string;
  full_name: string;
  username: string;
  authorities: { authority: EUserRole }[];
}

export * from './user';
export * from './contract';
export * from './news';
export * from './lawyer_work_history';
export * from './pay';
export * from './legal-affairs';
export * from './financial';
