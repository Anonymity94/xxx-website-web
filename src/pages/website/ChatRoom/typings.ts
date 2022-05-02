import type { EUserRole } from '@/data-typings';

/** 系统消息 */
export const SYSTEM_ID = '0';

export interface IMessage extends IReceiver, ISender {
  /** 消息发送时间 */
  timestamp: string | number;
  /** 消息内容 */
  text: string;
  /** 图片 base64 */
  image?: string;
  /** 文件ID */
  file?: string;
  /** 聊天连接状态 */
  status: EChatStatus;
  /** 律师服务记录ID */
  lawyerWorkId?: string;
  isMy?: boolean;
}

/** 最近联系人 */
export interface IChatContact extends ISender, IReceiver {
  id: number | string;
  createTime: string;
  record: string;
  recordList: IMessage[];
}

/** 以 receiverId + receiverRole 为 Key 的消息列表 */
export type IMessageMap = Record<string, IMessage[]>;

export type IMessageWithoutUser = Omit<IMessage, keyof ISender | keyof IReceiver | 'timestamp'>;

/** 消息接受者 */
export interface IReceiver {
  /** 接收人ID */
  receiverId: string;
  /** 接收人名字 */
  receiverName?: string;
  /** 接收人角色 */
  receiverRole: EUserRole;
}

/** 消息发送者 */
export interface ISender {
  /** 发送人ID */
  senderId: string;
  /** 发送人名字 */
  senderName?: string;
  /** 接收人角色 */
  senderRole: EUserRole;
}

/**
 * 连接状态
 * - open之后，第一次发送SYN
 * - 律师：有消息，返回ACK+msg，无消息，返回VOID
 * - 用户：在线，返回ACK
 * - 离线，返回VOID
 */
export enum EChatStatus {
  /**
   * 确认
   * @description 建立连接成功
   */
  'CHAT_ACK' = '1',
  /**
   * 同步
   * @description 接收消息
   */
  'CHAT_SYN' = '0',
  /**
   * 无效
   * @description 连接中止
   */
  'CHAT_VOID' = '2',
  /** 连接异常 */
  'CHAT_ERR' = '3',
  /** 对话结束 */
  'CHAT_FIN' = '4',
}

export interface ILocation {
  query: IReceiver & { orderId?: string };
}

export interface IDateRange {
  startTime: string;
  endTime: string;
}
