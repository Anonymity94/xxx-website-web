import type { ILegalAffairsIntroduction, ILegalAffairsService } from '@/data-typings';
import { EUserRole } from '@/data-typings';
import PageLayout from '@/layouts/PageLayout';
import { queryLegalAffairsIntroduction, queryLegalAffairsService } from '@/services';
import { Alert, Button, Card, Empty, message, Modal, Skeleton } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAccess, useModel } from 'umi';
import type { IPayModalRefProps } from '../PayModal';
import PayModal from '../PayModal';
import styles from './index.less';

export default () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const access = useAccess();
  const { isCompanyUser } = access;

  const payModalRef = useRef<IPayModalRefProps>();

  // 法务简介
  const [queryIntroductionLoading, setQueryIntroductionLoading] = useState(true);
  const [introductionDetail, setIntroductionDetail] = useState({} as ILegalAffairsIntroduction);

  // 法务套餐
  const [queryServiceLoading, setQueryServiceLoading] = useState(true);
  const [serviceList, setServiceList] = useState<ILegalAffairsService[]>([]);

  // 套餐列表弹出框
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setQueryIntroductionLoading(true);
    // 进入页面查询法务简介内容
    queryLegalAffairsIntroduction().then(({ success, result }) => {
      setQueryIntroductionLoading(false);
      if (success && Array.isArray(result) && result.length > 0) {
        setIntroductionDetail(result[0]);
      }
      if (!success) {
        message.error('获取页面内容失败');
      }
    });
  }, []);

  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const openLoginModal = useCallback(() => {
    setInitialState({ ...initialState, loginModalVisible: true });
  }, [initialState, setInitialState]);

  // const goToTaobao = () => {
  //   window.open('https://shop281956181.taobao.com/?spm=a230r.7195193.1997079397.2.238e5496rrkgTN');
  // };

  const kefuChat = () => {
    window.open(`/web/chat?receiverId=&receiverName=&receiverRole=${EUserRole.CUSTOMER_SERVICE}`);
  };

  const queryService = async () => {
    setQueryServiceLoading(true);
    const { success, result } = await queryLegalAffairsService();
    setQueryServiceLoading(false);
    setServiceList(success ? result : []);
    if (!success) {
      message.error('获取法务套餐列表失败');
    }
  };
  const showBuyModal = () => {
    // 先判断是否登录，没有登录的话先登录
    if (!access.isLogin) {
      openLoginModal();
      return;
    }
    // 如果身份不是普通用户的话，也不让购买
    if (!access.isUser) {
      message.info('您的身份不允许购买法务套餐');
      return;
    }
    showModal();
    queryService();
  };

  // TODO: 购买套餐
  const handleBuy = (serviceInfo: ILegalAffairsService) => {
    payModalRef.current?.handleBuyLegalAffairsService(serviceInfo);
  };

  useEffect(() => {
    if (access.isCompanyUser) {
      Modal.confirm({
        title: '您好企业用户，请问您现在需要什么服务吗？',
        okText: '进入客服咨询',
        cancelText: '随便看看',
        onOk: () => kefuChat(),
      });
    }
    if (!access.isLogin || access.isUser) {
      Modal.confirm({
        title: '您好，您尚未成为我们的企业用户。',
        okText: '马上购买',
        cancelText: '随便看看',
        onOk: () => showBuyModal(),
      });
    }
  }, []);

  return (
    <PageLayout>
      {!isCompanyUser && (
        <Alert
          message="本功能只针对企业用户开放"
          description="如果您有需要，请购买后联系我们的客服人员。"
          type="info"
          showIcon
          action={
            <Button size="small" type="primary" onClick={showBuyModal}>
              马上购买
            </Button>
          }
          style={{ marginBottom: 10 }}
        />
      )}

      <Skeleton active loading={queryIntroductionLoading}>
        <div
          dangerouslySetInnerHTML={{ __html: introductionDetail.introduction || '没有内容' }}
        ></div>
      </Skeleton>
      <Modal
        visible={modalVisible}
        onCancel={hideModal}
        footer={null}
        destroyOnClose
        maskClosable={false}
        keyboard={false}
      >
        <Skeleton active loading={queryServiceLoading}>
          <div className={styles['buy-list']}>
            {serviceList.length === 0 && <Empty description="没有找到相关的法务套餐" />}
            {serviceList.map((item) => (
              <Card key={item.id || item.name} className={styles['buy-item']} bordered size="small">
                <div className={styles['buy-item-header']}>
                  <div className={styles['buy-item-header-name']}>{item.name}</div>
                  <div className={styles['buy-item-header-price']}>￥{item.price}</div>
                  <div className={styles['buy-item-header-action']}>
                    <Button type="primary" onClick={() => handleBuy(item)}>
                      购买
                    </Button>
                  </div>
                </div>
                {item.description && (
                  <div className={styles['buy-item-description']}>{item.description}</div>
                )}
              </Card>
            ))}
          </div>
        </Skeleton>
      </Modal>
      <PayModal ref={payModalRef} />
    </PageLayout>
  );
};
