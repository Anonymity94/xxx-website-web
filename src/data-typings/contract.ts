/** 合同 */
import type { EBoolean, EStatus } from './index';

/** 合同大类 */
export interface IContractCategory {
  id: string;
  name: string;
  description: string;
  /** 大类下的子类 */
  children: IContractSubCategory[];
}

export type IContractCategoryMap = Record<string, IContractCategory>;

/** 合同小类 */
export interface IContractSubCategory {
  id: string;
  /** 大类名称 */
  name: string;
  /** 所属大类的ID, */
  categoryId: string;
  /** 所属大类的name, */
  categoryName: string;
  /** 备注信息 */
  description: string;
  /** 小类下的合同 */
  children: IContract[];
}
export type IContractSubCategoryMap = Record<string, IContractSubCategory>;

/** 合同 */
export interface IContract {
  /** ID, */
  id: string;
  /**  合同名称 */
  name: string;
  /**  所属大类的ID, */
  categoryId: string;
  /**  所属大类的name */
  categoryName: string;
  /**  所属子类的ID, */
  subcategoryId: string;
  /**  所属子类的name */
  subcategoryName: string;
  /**  合同简介描述信息 */
  profile: string;
  /**  下载价格（0-无限制） */
  price: number;
  /**  状态（0：启用，1：禁用） */
  status: EStatus;
  /**  是否是热门合同（0：否，1：是） */
  isHot: EBoolean;
  /**  合同的路径位置 */
  filePath: string;
  /**  合同预览的图片（需要把 pdf 转成几张图片，防止直接把文件放在前端被拖走，或者是想其他的办法） */
  filePreviewImg: string;
  /**  合同来源 */
  source: string;
  /**  下载次数 */
  downloadCount: number;
  /**  点击数 */
  visitCount: number;
}

export type IContractMap = Record<string, IContract>;

/** 合同全文检索结果 */
export interface IContractFullTextSearchResult {
  code: string;
  msg: string;
  data: [string, number][];
}
