import type { EUserRole, IAjaxResponseFactory } from '@/data-typings';
import type { IChatContact } from '@/pages/website/ChatRoom/typings';
import ajax from '@/utils/ajax';
import { stringify } from 'qs';

export interface IChatContactParams {
  receiverId: string;
  /**
   * 被动接收人角色
   * @description 律师、法务、客服
   */
  receiverRole: EUserRole;
  senderId: string;
  /**
   * 主动发起人角色
   * @description 游客、用户、企业用户
   */
  senderRole: EUserRole;
  /**
   * 开始时间日期
   * @eg. 2021-06-27
   */
  startTime: string;
  /**
   * 截至时间日期
   * @eg. 2021-06-30
   */
  endTime: string;
}

/** 获取某个人某个时间段内的联系人列表 */
export async function queryChatContactList(
  params: IChatContactParams,
): Promise<IAjaxResponseFactory<IChatContact[]>> {
  return ajax(`/chat/contacts?${stringify(params)}`);
}

export interface IChatMessgeHistoryParams {
  senderId: string;
  /**
   * 消息发起方角色
   * @description 理论上可以不限制，这里前端现在成律师和法务即可
   */
  senderRole: EUserRole;
  receiverId: string;
  /** 消息被发起方角色 */
  receiverRole: EUserRole;
  /**
   * 开始时间日期
   * @eg. 2021-06-27
   */
  startTime: string;
  /**
   * 截至时间日期
   * @eg. 2021-06-30
   */
  endTime: string;
}
/**
 * 获取指定2个人，某段时间段内的聊天历史记录
 */
export async function queryChatMessgeHistory(params: IChatMessgeHistoryParams) {
  return ajax(`/chat/messages?${stringify(params)}`);
}
