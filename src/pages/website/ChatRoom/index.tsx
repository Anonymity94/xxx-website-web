/* eslint-disable no-console */
import { PRODUCT_NAME, WEBSOCKET_URI } from '@/appConfig';
import type { IAjaxResponseFactory } from '@/data-typings';
import { EPayOrderStatus, EUserRole, USER_ROLE_LABEL_MAP } from '@/data-typings';
import {
  finishedLawyerChat,
  queryChatOrderUnused,
  queryOrderStatus,
  uploadChatFile,
} from '@/services';
import type { IChatContactParams, IChatMessgeHistoryParams } from '@/services/chat';
import { queryChatContactList, queryChatMessgeHistory } from '@/services/chat';
import { parseArray, randomSecret } from '@/utils/utils';
import { FileImageOutlined, FileOutlined, ReloadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import ReconnectingWebSocket from 'reconnectingwebsocket';
import {
  Affix,
  Alert,
  Badge,
  Button,
  Empty,
  Input,
  message as antdMessage,
  Modal,
  Space,
  Spin,
  Tag,
  Tooltip,
  Upload,
} from 'antd';
import type { TextAreaProps } from 'antd/lib/input';
import classNames from 'classnames';
import moment from 'moment';
import { stringify } from 'qs';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAccess, useLocation, useModel } from 'umi';
import type { IEvaluateRefProps } from './components/Evaluate';
import Evaluate from './components/Evaluate';
import Message from './components/Message';
import styles from './index.less';
import type {
  IChatContact,
  IDateRange,
  ILocation,
  IMessage,
  IMessageMap,
  IMessageWithoutUser,
  IReceiver,
} from './typings';
import { EChatStatus, SYSTEM_ID } from './typings';

/** 游客 ID 的前缀 */
const VISITOR_ID_PREFIX = 'visitor_';
const uuid = VISITOR_ID_PREFIX + randomSecret();
/** 上传文件的 Message 提示的 key */
const uploadFileLoadingKey = 'upload-file-key';

function getBase64(img: any, callback: (base64: string) => void) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
}

const ChatRoom = () => {
  const access = useAccess();
  const { initialState } = useModel('@@initialState');

  const location = useLocation() as any as ILocation;
  const { orderId } = location.query;

  // 最近
  const [dateRange] = useState<IDateRange>({
    startTime: moment().subtract(3, 'days').format('YYYY-MM-DD'),
    endTime: moment().format('YYYY-MM-DD'),
  });
  // 最近联系人列表
  const [contactList, setContactList] = useState<IChatContact[]>([]);
  const [contactListLoading, setContactListLoading] = useState(false);
  // 以接收人ID+接收人role为Key的消息列表
  const [messageMap, setMessageMap] = useState<IMessageMap>({});
  // 未读消息
  // 以消息发送人ID+消息发送人Role为key
  const [unReadMap, setUnReadMap] = useState<Record<string, number>>({});

  // 消息的接收人
  const [receiverUser, setReceiverUser] = useState<IReceiver>({
    receiverId: location.query.receiverId || '',
    receiverName: location.query.receiverName,
    receiverRole: location.query.receiverRole || EUserRole.USER,
  });

  // 历史记录查询loading
  const [queryHistoryLoading, setQueryHistoryLoading] = useState(false);

  // 订单支付状态
  const [orderStatus, setOrderStatus] = useState<IAjaxResponseFactory<EPayOrderStatus>>({
    success: false,
    result: EPayOrderStatus.Arrearage,
  });
  //
  const [pageReady, setPageReady] = useState<boolean>(false);
  // 是否重连过了
  const [connectioned, setReconnectioned] = useState<boolean>(false);

  // 律师和用户的orderId
  // 以用户ID+用户Role+律师ID+律师Role为key
  const [orderIdMap, setOrderIdMap] = useState<Record<string, string>>({});

  // 聊天输入的内容
  const [inputText, setInputText] = useState<string | undefined>();

  const socketRef = useRef<ReconnectingWebSocket>();
  // 消息内容框底部占位符ref
  const messagesContentEndRef = useRef<HTMLDivElement>(null);
  // 消息内容框底部ref
  const messageContentRef = useRef(null);
  // 点评弹出框
  const evaluateModalRef = useRef<IEvaluateRefProps>(null);

  /**
   * 发送人的信息，即当前人信息
   * 如果没有登录，随机一个 UUID，发送人置成游客
   */
  const currentUser = useMemo(() => {
    return {
      username: initialState?.currentUser?.full_name || '游客',
      id: initialState?.currentUser?.id ? String(initialState?.currentUser?.id) : uuid,
      role: initialState?.currentUser?.role || EUserRole.USER,
    };
  }, [initialState?.currentUser]);

  /**
   * 是否显示最近联系人
   * @description 律师、法务、客服时启用
   */
  const showContract = useMemo(() => {
    return (
      access.isLawyer || access.isCustomerService || access.isLegalAffairs || access.isCompanyUser
    );
  }, [access]);

  const orderKey = useMemo(() => {
    return showContract
      ? // 显示联系人表示收消息人是用户
        `${receiverUser.receiverId}_${receiverUser.receiverRole}_${currentUser.id}_${currentUser.role}`
      : // 用户和企业用户的话，发送人是用户
        `${currentUser.id}_${currentUser.role}_${receiverUser.receiverId}_${receiverUser.receiverRole}`;
  }, [
    currentUser.id,
    currentUser.role,
    receiverUser.receiverId,
    receiverUser.receiverRole,
    showContract,
  ]);

  useEffect(() => {
    if (!receiverUser.receiverId) {
      return;
    }
    if (currentUser.role !== EUserRole.LAWYER && receiverUser.receiverRole !== EUserRole.LAWYER) {
      return;
    }

    // 检查Map里面有没有Key，没有的话就请求orderId
    if (orderIdMap.hasOwnProperty(orderKey)) {
      return;
    }

    // 只有律师才会检查
    if (currentUser.role === EUserRole.LAWYER) {
      queryChatOrderUnused({
        userId: currentUser.role === EUserRole.LAWYER ? receiverUser.receiverId : currentUser.id,
        userRole:
          currentUser.role === EUserRole.LAWYER ? receiverUser.receiverRole : currentUser.role,
        lawyerId: currentUser.role === EUserRole.LAWYER ? currentUser.id : receiverUser.receiverId,
      }).then(({ success, result }) => {
        // 这里只有成功后再塞值，否则会有问题
        if (success && result.id && result.status === EPayOrderStatus.Account_Paid) {
          setOrderIdMap((prevMap) => ({
            ...prevMap,
            [orderKey]: result.id,
          }));
        }
      });
    }
  }, [currentUser, receiverUser, orderIdMap, orderKey]);

  // 是否是后端用户
  // 客服、律师、法务作为被发起人，所以应该是receiver
  const isBackendUser = useMemo(() => {
    return access.isLawyer || access.isLegalAffairs || access.isCustomerService;
  }, [access]);

  /** 当前律师服务ID */
  const currentOrderId = useMemo(() => {
    // 如果发消息人不是律师并且收消息人不是律师，直接返回空
    if (receiverUser.receiverRole !== EUserRole.LAWYER && currentUser.role !== EUserRole.LAWYER) {
      return '';
    }

    return orderIdMap[orderKey];
  }, [receiverUser.receiverRole, currentUser.role, orderIdMap, orderKey]);

  useEffect(() => {
    document.title = `在线咨询 - ${PRODUCT_NAME}`;
  }, []);

  // 校验是否可以聊天
  const canChat = useMemo(() => {
    // 游客 --> 客服
    if (!access.isLogin && receiverUser.receiverRole === EUserRole.CUSTOMER_SERVICE) {
      return true;
    }
    // 普通用户 --> 客服、律师
    if (
      access.isUser &&
      [EUserRole.LAWYER, EUserRole.CUSTOMER_SERVICE].includes(receiverUser.receiverRole)
    ) {
      return true;
    }
    // 企业用户 --> 客服、法务、律师
    if (
      access.isCompanyUser &&
      [EUserRole.LAWYER, EUserRole.CUSTOMER_SERVICE, EUserRole.LEGAL_AFFAIRS].includes(
        receiverUser.receiverRole,
      )
    ) {
      return true;
    }
    // 客服 --> 游客、用户、企业用户
    if (
      access.isCustomerService &&
      // 用户、企业用户
      ([EUserRole.USER, EUserRole.COMPANY_USER].includes(receiverUser.receiverRole) ||
        // 游客
        receiverUser.receiverId?.includes(VISITOR_ID_PREFIX))
    ) {
      return true;
    }
    // 律师 ---> 用户、企业用户
    if (
      access.isLawyer &&
      [EUserRole.USER, EUserRole.COMPANY_USER].includes(receiverUser.receiverRole)
    ) {
      return true;
    }
    // 法务 --> 企业用户
    if (access.isLegalAffairs && receiverUser.receiverRole === EUserRole.COMPANY_USER) {
      return true;
    }

    // 其他的对话一律拦截
    return false;
  }, [access, receiverUser]);

  // 当收消息人发生变化时，清空收消息人的未读数量
  useEffect(() => {
    // 律师、法务、客服启用
    if (!showContract) {
      return;
    }
    if (!receiverUser.receiverId) {
      return;
    }
    const key = `${receiverUser.receiverId}_${receiverUser.receiverRole}`;
    if (!unReadMap[key]) {
      return;
    }
    setUnReadMap((prevMap) => {
      return {
        ...prevMap,
        [key]: 0,
      };
    });
  }, [receiverUser, unReadMap, showContract]);

  // 如果是律师、法务，支持展示聊天记录
  useEffect(() => {
    if (pageReady && showContract) {
      const query = {} as IChatContactParams;
      if (isBackendUser) {
        query.receiverId = currentUser.id;
        query.receiverRole = currentUser.role;
      } else {
        query.senderId = currentUser.id;
        query.senderRole = currentUser.role;
      }

      setContactListLoading(true);
      queryChatContactList({
        ...query,
        ...dateRange,
      }).then(({ success, result }) => {
        setContactListLoading(false);
        if (success) {
          if (result.length === 0) {
            return;
          }
          // 序列化最近联系人中的消息列表
          const newContactList: IChatContact[] = [];
          for (let i = 0; i < result.length; i += 1) {
            const row = result[i];
            row.recordList = [];
            newContactList.push(row);
          }

          setContactList(newContactList);
          // setMessageMap(newMessageMap);
          if (newContactList.length > 0) {
            setReceiverUser({
              receiverId: isBackendUser ? newContactList[0].senderId : newContactList[0].receiverId,
              receiverRole: isBackendUser
                ? newContactList[0].senderRole
                : newContactList[0]?.receiverRole,
              receiverName: isBackendUser
                ? newContactList[0].senderName
                : newContactList[0]?.receiverName,
            });
          }
        }
      });
    }
  }, [pageReady, access, currentUser, dateRange, showContract, isBackendUser]);

  useEffect(() => {
    if (!pageReady) {
      return;
    }
    const query = {
      senderName: currentUser.username,
      senderId: currentUser.id,
      senderRole: currentUser.role,
      ...receiverUser,
    };

    // 检查聊天权限
    if (!canChat) {
      Modal.warning({
        title: `您的当前是身份为【${
          access.isLogin ? USER_ROLE_LABEL_MAP[currentUser.role] : '游客'
        }】，不支持和【${USER_ROLE_LABEL_MAP[receiverUser.receiverRole]}】进行在线咨询`,
        okText: '关闭窗口',
        onOk: () => window.close(),
      });
      return;
    }

    // 如果接收人是律师，那必须要有订单支付ID
    if (receiverUser.receiverRole === EUserRole.LAWYER) {
      if (!orderId) {
        Modal.warning({
          title: '律师咨询前需要先付费',
          okText: '关闭窗口',
          onOk: () => window.close(),
        });
        return;
      }
      if (!orderStatus.success) {
        Modal.warning({
          title: '律师咨询失败',
          content:
            '该律师咨询订单无效。请重新发起咨询订单，付款后尝试重新咨询。如有需要请联系管理员。',
          okText: '关闭窗口',
          onOk: () => window.close(),
        });
        return;
      }
      if (orderStatus.result === EPayOrderStatus.Arrearage) {
        Modal.warning({
          title: '律师咨询失败',
          content: '订单尚未支付。请支付后再进行律师咨询。',
          okText: '关闭窗口',
          onOk: () => window.close(),
        });
        return;
      }
      if (orderStatus.result === EPayOrderStatus.Used) {
        Modal.warning({
          title: '订单已使用。请重新发起咨询订单，付款后尝试重新咨询。如有需要请联系管理员。',
          okText: '关闭窗口',
          onOk: () => window.close(),
        });
        return;
      }
      // 填充orderMap
      setOrderIdMap({
        [orderKey]: orderId,
      });
      socketRef.current = new ReconnectingWebSocket(`${WEBSOCKET_URI}/chat/?${stringify(query)}`);
    } else {
      socketRef.current = new ReconnectingWebSocket(`${WEBSOCKET_URI}/chat/?${stringify(query)}`);
    }

    // 重连
    socketRef.current.debug = true;
    socketRef.current.reconnectInterval = 10 * 60 * 1000;
    socketRef.current.timeoutInterval = 10 * 60 * 1000;
    // 最多重连60次
    socketRef.current.maxReconnectAttempts = 60;
    socketRef.current.automaticOpen = false;
  }, [currentUser, pageReady, orderStatus]);

  useEffect(() => {
    if (!pageReady || !showContract) {
      return;
    }

    if (!receiverUser.receiverId || !currentUser.id) {
      return;
    }

    const historyParams: IChatMessgeHistoryParams = isBackendUser
      ? {
          senderId: receiverUser.receiverId,
          senderRole: receiverUser.receiverRole,
          receiverId: currentUser.id,
          receiverRole: currentUser.role,
          ...dateRange,
        }
      : {
          receiverId: receiverUser.receiverId,
          receiverRole: receiverUser.receiverRole,
          senderId: currentUser.id,
          senderRole: currentUser.role,
          ...dateRange,
        };

    setQueryHistoryLoading(true);
    queryChatMessgeHistory(historyParams).then(({ success, result }) => {
      setQueryHistoryLoading(false);
      if (!success) {
        antdMessage.warning('获取聊天记录异常');
        return;
      }

      const messageHistoryList = parseArray(result).reverse();
      // 更新聊天记录Map
      const key = `${receiverUser.receiverId}_${receiverUser.receiverRole}`;
      // 更新消息列表
      setMessageMap((prevMap) => {
        return { ...prevMap, [key]: messageHistoryList };
      });
    });
  }, [
    receiverUser.receiverId,
    receiverUser.receiverRole,
    isBackendUser,
    pageReady,
    showContract,
    currentUser.id,
    currentUser.role,
    dateRange,
  ]);

  useEffect(() => {
    if (!pageReady) {
      if (receiverUser.receiverRole === EUserRole.LAWYER && orderId) {
        (async () => {
          const response = await queryOrderStatus({ orderId });
          setOrderStatus(response);
          setPageReady(true);
        })();
      } else {
        setPageReady(true);
      }
    }

    return () => {
      socketRef.current?.close();
    };
  }, [pageReady]);

  const displayMessageList = useMemo(() => {
    if (!receiverUser.receiverId) {
      return [];
    }
    return messageMap[`${receiverUser.receiverId}_${receiverUser.receiverRole}`] || [];
  }, [messageMap, receiverUser]);

  const scrollToBottom = useCallback(() => {
    messagesContentEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesContentEndRef]);

  const socketIsOpen = useCallback(() => {
    // 检查socket状态，开启的时候才可以
    const { readyState } = socketRef?.current || {};
    if (!readyState || readyState !== WebSocket.OPEN) {
      antdMessage.warning('对话尚正在连接中或已关闭，请刷新页面重新请求');
      return false;
    }
    return true;
  }, [socketRef]);

  const updateMessageMap = useCallback(
    (message: IMessage) => {
      const receiverString = `${message.receiverId}_${message.receiverRole}`;
      const senderString = `${message.senderId}_${message.senderRole}`;
      const key = message.isMy ? receiverString : senderString;
      const currentUserString = `${currentUser.id}_${currentUser.role}`;

      const isFromSystem = message.senderId === SYSTEM_ID;

      // 消息的接收人不是自己
      if (showContract) {
        // 检查联系人，增加联系人
        if (receiverString !== currentUserString && senderString !== currentUserString) {
          setContactList((prevContact) => {
            if (!messageMap[key] && !isFromSystem) {
              return [
                ...prevContact,
                {
                  receiverId: message.receiverId,
                  receiverRole: message.receiverRole,
                  receiverName: message.receiverName,
                  senderId: message.senderId,
                  senderRole: message.senderRole,
                  senderName: message.senderName,
                  id: randomSecret(),
                  createTime: new Date().toUTCString(),
                  record: '',
                  recordList: [],
                },
              ];
            }

            return prevContact;
          });
        }
        // 更新消息未读数量
        if (!isFromSystem && !message.isMy) {
          setUnReadMap((prevMap) => {
            if (!prevMap[key]) {
              return {
                ...prevMap,
                [key]: 1,
              };
            }
            return {
              ...prevMap,
              [key]: prevMap[key] + 1,
            };
          });
        }
      }

      // 更新消息列表
      setMessageMap((prevMap) => {
        if (!prevMap[key]) {
          return { ...prevMap, [key]: [message] };
        }
        return {
          ...prevMap,
          [key]: [...prevMap[key], message],
        };
      });
    },
    [messageMap, showContract],
  );

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom, displayMessageList]);

  useEffect(() => {
    if (!socketRef || !socketRef.current) {
      return;
    }

    socketRef.current.onopen = () => {
      console.log('open');
    };

    socketRef.current.onerror = (error) => {
      console.log('WebSocket Error:', error);
    };

    // 接收消息
    socketRef.current.onmessage = (e) => {
      console.log('接收消息:', e.data);

      let message = {} as IMessage;
      try {
        message = JSON.parse(e.data);
      } catch (error) {
        message = {} as IMessage;
      }

      console.log('message.senderId', message.senderId);
      console.log('message.receiverId', message.receiverId);
      console.log('receiverUser', receiverUser);

      if (
        message.senderId === SYSTEM_ID &&
        message.status === EChatStatus.CHAT_VOID &&
        (receiverUser.receiverRole === EUserRole.LAWYER ||
          receiverUser.receiverRole === EUserRole.CUSTOMER_SERVICE)
      ) {
        antdMessage.info(
          <>
            <span>
              已通知{receiverUser.receiverRole === EUserRole.LAWYER ? '律师' : '客服'}
              ，请稍后刷新页面。
            </span>
            <Tooltip placement="topLeft" title="刷新页面">
              <span
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  window.location.reload();
                }}
              >
                <ReloadOutlined />
              </span>
            </Tooltip>
          </>,
          0,
        );
        return;
      }

      // 已经重连过
      if (connectioned && message.text === '对话开始') {
        console.log(new Date(), `re-connected on mesage`);
        return;
      }

      setReconnectioned(true);

      // 如果咨询的是客服，并且第一个消息不是客服发送的，就提示人工坐席繁忙，请稍后再试
      if (
        !receiverUser.receiverId &&
        receiverUser.receiverRole === EUserRole.CUSTOMER_SERVICE &&
        message.senderId === SYSTEM_ID
      ) {
        // antdMessage.warning(
        //   <>
        //     <span>人工坐席繁忙，请稍后刷新页面重新尝试。</span>
        //     <Tooltip placement="topLeft" title="刷新页面">
        //       <span
        //         style={{ cursor: 'pointer' }}
        //         onClick={() => {
        //           window.location.reload();
        //         }}
        //       >
        //         <ReloadOutlined />
        //       </span>
        //     </Tooltip>
        //   </>,
        //   0,
        // );
        return;
      }

      if (message.senderId && (message.text || message.image || message.file)) {
        // 如果当前接收人ID不存在,并且不是系统消息，就以第一个发送人为准
        if (!receiverUser.receiverId && message.senderId !== SYSTEM_ID) {
          setReceiverUser((prev) => ({
            ...prev,
            receiverId: message.senderId,
            receiverName: message.senderName,
            receiverRole: message.senderRole,
          }));
        }

        const newMessage = {
          ...message, // 系统发送的消息可能没有指定接收人
          receiverId: message.receiverId || currentUser.id,
          receiverName: message.receiverName || currentUser.username,
          receiverRole: message.receiverRole || currentUser.role,
        };

        updateMessageMap(newMessage);

        // 用户接收到律师的结束标识，可以开始弹出框
        if (
          `${newMessage.senderId}_${newMessage.senderRole}` ===
            `${receiverUser.receiverId}_${receiverUser.receiverRole}` &&
          newMessage.senderRole === EUserRole.LAWYER
        ) {
          // 对话结束了，就弹出评价框
          if (newMessage.status === EChatStatus.CHAT_FIN && currentOrderId) {
            evaluateModalRef.current?.openModal();
          }
          return;
        }

        // 如果发送人不是律师，并且接收人是用户，直接关闭
        if (
          newMessage.senderId !== EUserRole.LAWYER &&
          newMessage.status === EChatStatus.CHAT_FIN &&
          `${newMessage.receiverId}_${newMessage.receiverRole}` ===
            `${currentUser.id}_${currentUser.role}` &&
          (currentUser.role === EUserRole.USER || currentUser.role === EUserRole.COMPANY_USER)
        ) {
          Modal.info({
            title: '对话已完成',
            content: '关闭窗口并返回首页',
            okText: '返回首页',
            onOk: () => {
              // 关闭页面
              window.close();
            },
          });
        }
      }
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket closed');
      const message: IMessage = {
        timestamp: new Date().valueOf(),
        senderName: '系统',
        senderId: SYSTEM_ID,
        senderRole: EUserRole.SYSTEM,
        receiverName: currentUser.username,
        receiverId: currentUser.id,
        receiverRole: currentUser.role,
        text: '对话超时，已自动结束',
        image: '',
        status: EChatStatus.CHAT_VOID,
      };
      updateMessageMap(message);
    };
  }, [
    socketRef,
    currentUser,
    receiverUser,
    currentOrderId,
    pageReady,
    updateMessageMap,
    connectioned,
  ]);

  const handleTextAreaChange: TextAreaProps['onChange'] = (e) => {
    setInputText(e.target.value);
  };

  /** 构建新消息 */
  const buildMessage = useCallback(
    (msg: IMessageWithoutUser) => {
      return {
        timestamp: new Date().valueOf(),
        senderName: currentUser.username,
        senderId: currentUser.id,
        senderRole: currentUser.role,
        ...receiverUser,
        ...msg,
      } as IMessage;
    },
    [currentUser, receiverUser],
  );

  /** 发送消息 */
  const handleSendMessage = (message?: IMessage) => {
    // 检查socket状态，开启的时候才可以
    if (!socketIsOpen()) {
      antdMessage.warning(
        <>
          <span>对话准备中...请刷新页面重新连接</span>
          <Tooltip placement="topLeft" title="刷新页面">
            <span
              style={{ cursor: 'pointer' }}
              onClick={() => {
                window.location.reload();
              }}
            >
              <ReloadOutlined />
            </span>
          </Tooltip>
        </>,
        0,
      );
      return;
    }

    if (currentUser.role === EUserRole.LAWYER && !currentOrderId) {
      antdMessage.warning('该用户尚未购买咨询服务，无法收到消息');
      return;
    }

    const newMessage: IMessage =
      message ||
      buildMessage({
        text: inputText || '',
        status: EChatStatus.CHAT_SYN,
      });

    if (!newMessage?.text && !newMessage.image && !newMessage.file) {
      antdMessage.warning('请输入消息');
      return;
    }
    if (!receiverUser.receiverId) {
      antdMessage.warning('请指定消息接收人');
      return;
    }
    console.log('消息发送', newMessage);
    // 发送消息
    socketRef.current?.send(JSON.stringify(newMessage));

    updateMessageMap({ ...newMessage, isMy: true });
    // 清空
    setInputText(undefined);
  };

  /** 发送图片 */
  const handleSendImage: UploadProps['onChange'] = (info) => {
    console.log('image', info);
    getBase64(info.file, (imageUrl) => {
      const newMessage: IMessage = buildMessage({
        text: '',
        image: imageUrl,
        status: EChatStatus.CHAT_SYN,
      });
      handleSendMessage(newMessage);
    });
  };

  const handleSendFile: UploadProps['onChange'] = (info) => {
    console.log('file', info);
    // 上传文件
    const formData = new FormData();
    formData.append('file', info.file as any);

    antdMessage.loading({ content: '文件上传中...', duration: 0, key: uploadFileLoadingKey });
    uploadChatFile(formData).then(({ success, result }) => {
      // 删除
      antdMessage.destroy(uploadFileLoadingKey);

      if (success && result.filePath) {
        const newMsg = buildMessage({
          text: '',
          file: result.filePath,
          status: EChatStatus.CHAT_SYN,
        });
        handleSendMessage(newMsg);
      } else {
        antdMessage.error('文件发送失败');
      }
    });
  };

  const handleTextAreaEnter: TextAreaProps['onPressEnter'] = (e) => {
    if (!e.shiftKey) {
      e.preventDefault();
      // TODO: 发送
      handleSendMessage();
    }
  };

  /** 用户主动关闭对话 */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleUserFinishedChat = () => {
    // 检查socket状态，开启的时候才可以
    if (!socketIsOpen()) {
      return;
    }

    const finMsg: IMessage = buildMessage({
      text: `用户已退出聊天`,
      status: EChatStatus.CHAT_SYN,
    });

    Modal.confirm({
      title: '确定结束次对话吗？',
      content: '对话结束后将无法恢复。下次对话将需要重新支付咨询费用。',
      onOk: async () => {
        handleSendMessage(finMsg);
        // 结束计费标准
        await finishedLawyerChat({ orderId: orderId! });
        // 关闭页面
        window.close();
      },
    });
  };

  const handleLawyerFinishChat = () => {
    // 检查socket状态，开启的时候才可以
    if (!socketIsOpen()) {
      return;
    }

    const finMsg: IMessage = buildMessage({
      text: `对话已完成${currentUser.role === EUserRole.LAWYER ? '，请您完成评价' : ''}`,
      status: EChatStatus.CHAT_FIN,
    });

    Modal.confirm({
      title: '确定结束次对话吗？',
      content: '结束对话后，用户需要开启新的咨询订单才能和您进行对话。',
      onOk: async () => {
        handleSendMessage(finMsg);
        // 关闭对话状态
        await finishedLawyerChat({ orderId: currentOrderId });
        // 删除服务ID
        setOrderIdMap((prevMap) => ({
          ...prevMap,
          [`${finMsg.receiverId}_${finMsg.receiverRole}_${finMsg.senderId}_${finMsg.senderRole}`]:
            '',
        }));
      },
    });
  };

  console.log('orderIdMap', orderIdMap);
  console.log('currentOrderId', currentOrderId);

  return (
    <div className={styles.main}>
      <div className={styles['chat-room-wrap']}>
        {showContract && (
          <div className={styles['chat-room-left']}>
            <div className={styles['chat-room-left-header']}>最近 3 天联系人</div>
            <div className={styles['chat-room-left-content']}>
              <ul className={styles['chat-room-receiver-list']}>
                <Spin spinning={contactListLoading}>
                  <>
                    {contactList.length === 0 && (
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无联系人" />
                    )}
                    {contactList.map((contact) => (
                      <li
                        key={contact.id}
                        className={classNames({
                          [styles.active]:
                            (isBackendUser ? contact.senderId : contact.receiverId) ===
                            receiverUser.receiverId,
                        })}
                        onClick={() =>
                          setReceiverUser({
                            receiverId: isBackendUser ? contact.senderId : contact.receiverId,
                            receiverRole: isBackendUser ? contact.senderRole : contact.receiverRole,
                            receiverName: isBackendUser ? contact.senderName : contact.receiverName,
                          })
                        }
                      >
                        {isBackendUser ? contact.senderName : contact.receiverName}
                        {(isBackendUser
                          ? `${contact.senderId}_${contact.senderRole}`
                          : `${contact.receiverId}_${contact.receiverRole}`) !==
                          `${receiverUser.receiverId}_${receiverUser.receiverRole}` && (
                          <Badge
                            count={
                              unReadMap[
                                isBackendUser
                                  ? `${contact.senderId}_${contact.senderRole}`
                                  : `${contact.receiverId}_${contact.receiverRole}`
                              ] || 0
                            }
                            style={{ backgroundColor: '#52c41a' }}
                          />
                        )}
                      </li>
                    ))}
                  </>
                </Spin>
              </ul>
            </div>
          </div>
        )}
        <div className={styles['chat-room-right']}>
          <div className={styles['chat-room-right-header']}>
            <div>
              在线咨询 {receiverUser.receiverId ? `[${receiverUser.receiverName}]` : ''}
              {receiverUser.receiverRole === EUserRole.COMPANY_USER ? (
                <Tag style={{ marginLeft: 6 }} color="#108ee9">
                  企业用户
                </Tag>
              ) : (
                ''
              )}
            </div>
            {access.isLawyer &&
              (currentOrderId ? (
                <Button
                  key="lawyer-finished"
                  type="primary"
                  danger
                  onClick={handleLawyerFinishChat}
                >
                  结束对话
                </Button>
              ) : (
                <Button type="link">用户服务已结束</Button>
              ))}
            {/* {(currentUser.role === EUserRole.USER || currentUser.role === EUserRole.COMPANY_USER) &&
              receiverUser.receiverRole === EUserRole.LAWYER && (
                <Button key="user-finished" type="primary" danger onClick={handleUserFinishedChat}>
                  结束对话
                </Button>
              )} */}
          </div>

          <div className={styles['chat-room-right-content']} ref={messageContentRef}>
            {!showContract && (
              <Affix offsetTop={10} target={() => messageContentRef.current}>
                <Alert
                  banner
                  type="info"
                  showIcon
                  message="离开本页面将丢失会话消息，重新建立会话。"
                  closable
                />
              </Affix>
            )}
            {queryHistoryLoading ? (
              <Spin spinning={queryHistoryLoading}>
                <div style={{ height: 100 }}></div>
              </Spin>
            ) : (
              <>
                {displayMessageList.map((message) => (
                  <Message
                    key={`${message.timestamp}_${message.senderId}_${message.senderRole}_${message.receiverId}_${message.receiverRole}`}
                    isMy={
                      `${message.senderId}_${message.senderRole}` ===
                      `${currentUser.id}_${currentUser.role}`
                    }
                    message={message}
                  />
                ))}
                <div
                  className={styles['chat-room-right-content-footer-placeholder']}
                  ref={messagesContentEndRef}
                />
              </>
            )}
          </div>
          <div className={styles['chat-room-right-footer']}>
            <div className={styles['chat-room-input-file']}>
              <Space>
                <Tooltip title="上传图片">
                  <Upload
                    accept=".png,.jpg"
                    fileList={[]}
                    showUploadList={false}
                    beforeUpload={() => false}
                    onChange={handleSendImage}
                  >
                    <FileImageOutlined />
                  </Upload>
                </Tooltip>
                <Tooltip title="上传文件">
                  <Upload
                    accept=".pdf,.xls,.xlsx,.doc,.docx,.txt"
                    fileList={[]}
                    showUploadList={false}
                    beforeUpload={() => false}
                    onChange={handleSendFile}
                  >
                    <FileOutlined />
                  </Upload>
                </Tooltip>
              </Space>
            </div>
            <div className={styles['chat-room-input-wrap']}>
              <Input.TextArea
                className={styles['chat-room-input']}
                value={inputText}
                placeholder="请输入您的问题"
                autoSize={{ minRows: 4, maxRows: 4 }}
                bordered={false}
                onPressEnter={handleTextAreaEnter}
                onChange={handleTextAreaChange}
              />
              <Button
                className={styles['chat-room-input-submit']}
                block
                type="primary"
                disabled={!inputText || !receiverUser.receiverId}
                onClick={() => handleSendMessage()}
              >
                发送
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* 登录用户和企业用户才显示 */}
      {(access.isUser || access.isCompanyUser) && (
        <Evaluate orderId={currentOrderId} ref={evaluateModalRef} />
      )}
    </div>
  );
};

export default ChatRoom;
