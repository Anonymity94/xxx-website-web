import type { EBoolean, EStatus, IPageParmas } from './index';

export interface INews {
  /** ID, */
  id: string;
  /**  新闻标题 */
  title: string;
  /**  背景图，可以是多个? */
  coverImgs: string;
  /**  新闻简介 */
  profile: string;
  /**  状态（0：启用，1：禁用） */
  status: EStatus;
  /**  是否置顶（0：否，1：是） */
  isTop: EBoolean;
  /**  新闻内容（富文本） */
  content: string;
  /**  点击数 */
  visitCount: number;
  /**  创建时间  */
  createTime: number;
}

export interface INewsQueryParams extends IPageParmas {
  status: EStatus;
}
