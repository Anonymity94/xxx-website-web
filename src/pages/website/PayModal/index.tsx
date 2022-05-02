import type {
  IContract,
  ILawyer,
  IPayOrder,
  IAjaxResponseFactory,
  ILegalAffairsService,
} from '@/data-typings';
import { EPayOrderStatus, EPayType, EPayTypeText, EStatus, EUserRole } from '@/data-typings';
import {
  adminDownloadContract,
  downloadContract,
  queryBuyLegalAffairsServiceOrder,
  queryChatOrderUnused,
  queryContractOrder,
  queryLawyerChatOrder,
  queryOrderStatus,
} from '@/services';
import { AlipayCircleOutlined } from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';
import { Typography } from 'antd';
import { Divider, message, Modal, Radio, Spin } from 'antd';
import classNames from 'classnames';
import UAParser from 'ua-parser-js';
import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useAccess, useModel } from 'umi';
import wexinPayIcon from './assets/wexin-pay.svg';
import styles from './index.less';

const PayBox = ({ type }: { type: EPayType }) => {
  const isAlipay = type === EPayType.AliPay;
  const isWeixinPay = type === EPayType.WeiXinPay;
  return (
    <div
      className={classNames({
        [styles.payBox]: true,
        [styles.weixin]: isWeixinPay,
        [styles.ali]: isAlipay,
      })}
    >
      <span className={styles.icon}>
        {isAlipay ? <AlipayCircleOutlined /> : <img src={wexinPayIcon} />}
      </span>
      <span className={styles.txt}>{EPayTypeText[type]}支付</span>
    </div>
  );
};

/** 支付用途 */
enum EPayPurpose {
  /** 合同下载 */
  'Contract_Download' = 0,
  /** 律师咨询 */
  'Lawyer_Chat',
  /** 法务套餐 */
  'Legal_Affairs_Service',
}

type IPayModalProps = Record<string, any>;
export interface IPayModalRefProps {
  /** 合同下载 */
  handleDownload: (contract: IContract) => void;
  /** 律师咨询 */
  handleLawyerChat: (lawyer: ILawyer) => void;
  /** 共享法务套餐购买 */
  handleBuyLegalAffairsService: (legalAffairsService: ILegalAffairsService) => void;
}
const PayModal = React.forwardRef((props: IPayModalProps, ref: any) => {
  const access = useAccess();
  const { initialState, setInitialState, refresh } = useModel('@@initialState');

  // 付款目的：合同下载，律师咨询
  const [payPurpose, setPayPurpose] = useState<EPayPurpose | undefined>();
  // 合同信息
  const [contract, setContract] = useState<IContract | undefined>();
  // 律师信息
  const [lawyer, setLawyer] = useState<ILawyer | undefined>();
  // 共享服务套餐信息
  const [legalAffairsService, setLegalAffairsService] = useState<
    ILegalAffairsService | undefined
  >();
  // 是否显示付款弹出框
  const [visible, setVisible] = useState(false);
  // 支付模式
  const [payType, setPayType] = useState<EPayType>(EPayType.AliPay);

  // 付款订单信息
  const [orderInfo, setOrderInfo] = useState<IPayOrder | undefined>(undefined);
  // 订单信息loading
  const [orderInfoLoading, setOrderInfoLoading] = useState<boolean>(false);

  /** 检查订单的定时器 */
  const checkOrderStatusTimerRef = useRef<number | undefined>();

  /** 清除轮询查状态的定时器 */
  const clearTimer = () => {
    window.clearInterval(checkOrderStatusTimerRef.current);
  };

  const openLoginModal = useCallback(() => {
    setInitialState({ ...initialState, loginModalVisible: true });
  }, [initialState, setInitialState]);

  const openPayModal = () => {
    setVisible(true);
  };

  const closePayModal = () => {
    setVisible(false);
  };

  /** 支付弹出框关闭后 */
  const closeAfter = () => {
    // 清除定时
    clearTimer();
    // 清除信息
    setOrderInfo(undefined);
    setOrderInfoLoading(false);
    setContract(undefined);
    setLawyer(undefined);
    setLegalAffairsService(undefined);
    setPayPurpose(undefined);
  };

  /** 处理合同下载 */
  const handleDownload = (contractDetail: IContract) => {
    // 判断是否是 PC 端
    const parser = new UAParser();
    const deviceType = parser.getDevice().type;
    if (deviceType) {
      Modal.info({
        title: '请移步 PC 端进行下载',
        content: '',
      });
      return;
    }

    if (!contractDetail.id) {
      message.warning('无效的合同');
      return;
    }
    // 判断角色
    // 管理员、法务、客服 可以直接下载
    if (access.isLogin && (access.isAdmin || access.isCustomerService || access.isLegalAffairs)) {
      adminDownloadContract(contractDetail.id);
      return;
    }

    setPayPurpose(EPayPurpose.Contract_Download);
    setContract(contractDetail);
    // 热门合同也需要支付下载
    if (contractDetail.isHot) {
      setTimeout(() => {
        openPayModal();
      }, 0);
      return;
    }

    // 如果已经登录，但是角色不是管理员，需要跳转到别的地方进行下载
    // if (access.isLogin) {
    //   Modal.confirm({
    //     title: 'TODO: 已登录，需要跳转到别的页面进行下载',
    //   });
    //   return;
    // }

    // 其他的需要扫码付款
    setTimeout(() => {
      openPayModal();
    }, 0);
  };

  /** 处理律师聊天 */
  const handleLawyerChat = async (lawyerDetail: ILawyer) => {
    await refresh();
    // 如果没有登录，提示先登录
    if (!access.isLogin) {
      openLoginModal();
      return;
    }

    // 律师咨询只针对普通用户和企业用户
    if (access.isLogin && !access.isCompanyUser && !access.isUser) {
      Modal.info({
        title: '律师咨询功能只针对用户和企业用户开放',
        okText: '关闭页面',
        onOk: () => window.close(),
      });
      return;
    }

    // 如果是企业用户或者是登录的用户，先查询有无已支付的订单
    const response = await queryChatOrderUnused({
      userId: initialState!.currentUser!.id,
      userRole: initialState!.currentUser!.role,
      lawyerId: lawyerDetail.id,
    });

    if (
      response.success &&
      response.result.id &&
      response.result.status === EPayOrderStatus.Account_Paid
    ) {
      // 直接跳转到
      Modal.confirm({
        title: '查询到您有已支付订单',
        content: '请问您是否要继续咨询？',
        okText: '继续咨询',
        onOk: () => {
          window.open(
            `/web/chat?receiverId=${lawyerDetail!.id}&receiverName=${
              lawyerDetail!.fullName
            }&receiverRole=${EUserRole.LAWYER}&orderId=${response.result.id}`,
          );
        },
        cancelText: '待会再说',
        onCancel: () => {},
      });
      return;
    }

    if (!lawyerDetail.id) {
      message.warning('无效的律师');
      return;
    }
    // 检查律师的状态
    if (lawyerDetail.orderStatus === EStatus.Closed) {
      message.warning('律师暂时停止接受新订单，请稍后再试。');
      return;
    }

    setPayPurpose(EPayPurpose.Lawyer_Chat);
    setLawyer(lawyerDetail);
    setTimeout(() => {
      openPayModal();
    }, 0);
  };

  const handleBuyLegalAffairsService = async (legalAffairsServiceDetail: ILegalAffairsService) => {
    await refresh();
    // 如果没有登录，提示先登录
    if (!access.isLogin) {
      openLoginModal();
      return;
    }

    // 律师咨询只针对普通用户和企业用户
    if (!access.isUser) {
      Modal.info({
        title: '只有用户才可以购买法务套餐',
        okText: '知道了',
      });
      return;
    }

    setPayPurpose(EPayPurpose.Legal_Affairs_Service);
    setLegalAffairsService(legalAffairsServiceDetail);
    setTimeout(() => {
      openPayModal();
    }, 0);
  };

  // 获取订单信息
  const queryOrderInfo = useCallback(() => {
    if (payPurpose === EPayPurpose.Contract_Download && contract?.id) {
      return queryContractOrder({ contractId: contract!.id, payType });
    }
    if (payPurpose === EPayPurpose.Lawyer_Chat && lawyer?.id) {
      return queryLawyerChatOrder({
        lawyerId: lawyer!.id,
        payType,
        userId: initialState!.currentUser!.id,
        userRole: initialState!.currentUser!.role,
      });
    }
    if (payPurpose === EPayPurpose.Legal_Affairs_Service) {
      return queryBuyLegalAffairsServiceOrder({
        serviceId: legalAffairsService!.id,
        payType,
      });
    }

    return new Promise<IAjaxResponseFactory<IPayOrder>>((resolve) => {
      resolve({ success: false, result: undefined as any });
    });
  }, [contract, lawyer, legalAffairsService, payType, payPurpose]);

  // 获取订单支付状态
  const doQueryContractOrderStatus = () => {
    // 先清除定时器
    clearTimer();

    if (!visible) {
      return;
    }
    // 没有订单ID，不请求订单支付状态
    if (!orderInfo?.orderId) {
      return;
    }

    // 发起请求
    queryOrderStatus({
      orderId: orderInfo.orderId,
    }).then((response) => {
      const { success, result } = response;
      if (!success) {
        message.error('订单支付状态查询失败，请联系管理员');
        return;
      }
      // 未支付结果下，继续轮训查
      if (result === EPayOrderStatus.Arrearage) {
        // 5s 一查询
        checkOrderStatusTimerRef.current = window.setInterval(
          () => doQueryContractOrderStatus(),
          3 * 1000,
        );
        return;
      }
      // 支付成功进行下载
      if (result === EPayOrderStatus.Account_Paid) {
        // 合同下载
        if (payPurpose === EPayPurpose.Contract_Download) {
          message.success('支付成功，合同下载中...');
          downloadContract({ orderId: orderInfo.orderId });
        }

        // 进入聊天室
        if (payPurpose === EPayPurpose.Lawyer_Chat) {
          window.open(
            `/web/chat?receiverId=${lawyer!.id}&receiverName=${lawyer!.fullName}&receiverRole=${
              EUserRole.LAWYER
            }&orderId=${orderInfo.orderId}`,
          );
        }
        // 关闭弹出框
        closePayModal();

        // 法务套餐
        if (payPurpose === EPayPurpose.Legal_Affairs_Service) {
          Modal.success({
            title: '购买成功',
            content: (
              <>
                您的订单编号是：
                <Typography.Paragraph copyable>{orderInfo?.orderId}</Typography.Paragraph>
                请和客服人员反馈此订单编号，进行下一步操作。
              </>
            ),
            okText: '联系客服',
            keyboard: false,
            maskClosable: false,
            onOk: () => {
              window.open(
                `/web/chat?receiverId=&receiverName=&receiverRole=${EUserRole.CUSTOMER_SERVICE}`,
              );
            },
          });
        }
      }
    });
  };

  const handlePayTypeChange = (e: RadioChangeEvent) => {
    setPayType(e.target.value);
  };

  useEffect(() => {
    if (!visible) {
      return;
    }
    if (
      (payPurpose === EPayPurpose.Contract_Download && contract?.id) ||
      (payPurpose === EPayPurpose.Lawyer_Chat && lawyer?.id) ||
      (payPurpose === EPayPurpose.Legal_Affairs_Service && legalAffairsService?.id)
    ) {
      // 清除定时
      clearTimer();

      // 重新获取请求
      setOrderInfoLoading(true);
      queryOrderInfo().then((response) => {
        setOrderInfoLoading(false);
        const { success, result } = response;
        setOrderInfo(success ? result : undefined);
        if (!success) {
          message.error('获取付款码失败');
        }
      });
    }
  }, [visible, queryOrderInfo, payType, payPurpose, contract, lawyer, legalAffairsService]);

  useEffect(() => {
    if (!visible) {
      return;
    }
    // 没有订单ID，不请求订单支付状态
    if (!orderInfo?.orderId) {
      return;
    }
    // 5秒后查询一次
    checkOrderStatusTimerRef.current = window.setInterval(
      () => doQueryContractOrderStatus(),
      5 * 1000,
    );
  }, [orderInfo, visible]);

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, []);

  useImperativeHandle(ref, () => ({
    handleDownload,
    handleLawyerChat,
    handleBuyLegalAffairsService,
  }));

  const renderContent = () => {
    return (
      <>
        <p className={styles.title}>{EPayTypeText[payType]}扫一扫付款（元）</p>
        <div className={styles.money}>
          <Spin spinning={orderInfoLoading}>￥{orderInfo?.price || 0}</Spin>
        </div>
        <div className={styles.wrap}>
          <Spin spinning={orderInfoLoading}>
            <div className={styles.imgWrap}>
              {orderInfo?.image ? (
                <img height="200" src={orderInfo?.image} />
              ) : (
                <span>
                  {orderInfoLoading ? '获取付款码中...' : orderInfo?.msg || '获取付款码失败'}
                </span>
              )}
            </div>
          </Spin>
          <PayBox type={payType} />
        </div>
      </>
    );
  };

  return (
    <Modal
      visible={visible}
      destroyOnClose
      maskClosable={false}
      keyboard={false}
      title="扫码支付"
      footer={null}
      onCancel={closePayModal}
      afterClose={closeAfter}
    >
      <div className={styles.qrcodeWrap}>
        <Radio.Group onChange={handlePayTypeChange} value={payType}>
          {[EPayType.AliPay, EPayType.WeiXinPay].map((type) => (
            <Radio value={type} key={type}>
              <PayBox type={type} />
            </Radio>
          ))}
        </Radio.Group>

        <Divider />

        {renderContent()}
      </div>
    </Modal>
  );
});

export default PayModal;
