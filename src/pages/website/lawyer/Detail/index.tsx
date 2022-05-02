import { PRODUCT_NAME, UPLOAD_FILE_PATH_PREFIX } from '@/appConfig';
import IconText from '@/components/IconText';
import type { ILawyer } from '@/data-typings';
import { EStatus } from '@/data-typings';
import PageLayout from '@/layouts/PageLayout';
import type { ConnectState } from '@/models/connect';
import {
  DisconnectOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  HomeOutlined,
  MoneyCollectOutlined,
  ProfileOutlined,
} from '@ant-design/icons';
import { message, Result, Skeleton, Space, Tabs, Typography } from 'antd';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import type { Dispatch } from 'umi';
import { connect, useAccess, useParams } from 'umi';
import type { IPayModalRefProps } from '../../PayModal';
import PayModal from '../../PayModal';
import CaseHistory from '../components/CaseHistory';
import Icon from '../components/Icon';
import styles from './index.less';

const { TabPane } = Tabs;

interface ILawyerDetailProps {
  dispatch: Dispatch;
  queryLoading: boolean;
  detail: ILawyer;
}
const LawyerDtail = ({ dispatch, queryLoading, detail = {} as ILawyer }: ILawyerDetailProps) => {
  const access = useAccess();
  const payModalRef = useRef<IPayModalRefProps>();
  const [isReady, setIsReady] = useState(false);
  const { id }: { id: string } = useParams();
  useEffect(() => {
    dispatch({
      type: 'lawyerModel/queryLawyerDetail',
      payload: { id },
    });

    return () => {
      dispatch({
        type: 'lawyerModel/updateState',
        payload: { detail: {} },
      });
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (!isReady) {
      setIsReady(true);
    }
  }, [isReady]);

  if (!isReady || queryLoading) {
    return <Skeleton active />;
  }

  if (!detail.id) {
    return <Result status="info" title="资源不存在或已被删除" />;
  }

  return (
    <>
      <div className={styles.header}>
        <PageLayout showBanner={false} showBreadcrumb={false} disableContentMargin>
          <div className={styles['header-wrap']}>
            <div
              className={styles['header-avatar']}
              style={{ backgroundImage: `url(${UPLOAD_FILE_PATH_PREFIX}${detail.avatar})` }}
            ></div>
            <div className={styles['header-content']}>
              <Space>
                <span className={styles.fullname}>{detail.fullName}律师</span>
                <span className={styles.tag}>
                  <Icon type="qualification" />
                </span>
                {detail.orderStatus === EStatus.Closed && (
                  <span>
                    <IconText icon={DisconnectOutlined} text="离线" />
                  </span>
                )}
              </Space>
              <p className={styles.lawyerTitle}>{detail.title}</p>
              <p>{detail.company}</p>
              <p>
                <IconText
                  icon={EnvironmentOutlined}
                  text={`${detail.province || ''}${detail.city ? ` - ${detail.city}` : ''}`}
                />
              </p>
              <div className={styles.action}>
                {/* <span>公益解答</span> */}
                <span
                  className={classNames({
                    [styles.disabled]:
                      detail.orderStatus === EStatus.Closed ||
                      (!access.isUser && !access.isCompanyUser),
                  })}
                  onClick={() => {
                    if (detail.orderStatus === EStatus.Closed) {
                      message.info(`${detail.fullName}律师暂时不在线`);
                      return;
                    }
                    if (!access.isUser && !access.isCompanyUser) {
                      message.info('律师咨询服务只针对用户和企业用户开放');
                      return;
                    }
                    payModalRef.current?.handleLawyerChat(detail);
                  }}
                >
                  <IconText icon={MoneyCollectOutlined} text="有偿咨询" />
                </span>
              </div>
            </div>
            <div className={styles['header-description']}>
              <div className={styles['phone-box']}>
                <span className={styles.phone}>有问题，找{PRODUCT_NAME}</span>
              </div>
              <div className={styles.description}>
                <Typography.Paragraph ellipsis={{ rows: 2 }}>
                  <b>擅长领域：</b>
                  {detail.goodAt}
                </Typography.Paragraph>
              </div>
              <div className={styles.description}>
                <Typography.Paragraph ellipsis={{ rows: 3 }}>
                  <b>个人简介：</b>
                  {detail.profile}
                </Typography.Paragraph>
              </div>
            </div>
          </div>
        </PageLayout>
      </div>
      <div className={styles.content}>
        <PageLayout showBanner={false}>
          <Tabs defaultActiveKey="1" type="card" size="large" className={styles.tabs}>
            <TabPane tab="律师档案" key="1">
              <section className={styles.section}>
                <p className={styles['section-title']}>
                  <ProfileOutlined />
                  律师简介
                </p>
                <div>{detail.profile}</div>
              </section>
              <section className={styles.section}>
                <p className={styles['section-title']}>
                  <FileTextOutlined />
                  详细档案
                </p>
                <div dangerouslySetInnerHTML={{ __html: detail.archive }}></div>
              </section>
            </TabPane>
            <TabPane tab="服务范围" key="2">
              <div dangerouslySetInnerHTML={{ __html: detail.serviceScope }}></div>
            </TabPane>
            <TabPane tab="用户评价" key="3">
              <CaseHistory lawyer={detail} />
            </TabPane>
            {/* <TabPane tab="服务记录" key="4">
              服务记录
            </TabPane> */}
            <TabPane tab="联系方式" key="5">
              <section className={styles.section}>
                <p className={styles['section-title']}>
                  <HomeOutlined />
                  律所
                </p>
                <div>{detail.company}</div>
              </section>
              <section className={styles.section}>
                <p className={styles['section-title']}>
                  <EnvironmentOutlined />
                  地址
                </p>
                <div>{`${detail.province || ''}${detail.city ? ` - ${detail.city}` : ''}`}</div>
                <div>{detail.location}</div>
              </section>
              {/* <section className={styles.section}>
                <p className={styles['section-title']}>
                  <PhoneOutlined />
                  手机号码
                </p>
                <div>{detail.telephone}</div>
              </section> */}
            </TabPane>
          </Tabs>
        </PageLayout>
        <PayModal ref={payModalRef} />
      </div>
    </>
  );
};

export default connect(({ loading: { effects }, lawyerModel: { detail } }: ConnectState) => ({
  queryLoading: effects['lawyerModel/queryLawyerDetail'] || false,
  detail,
}))(LawyerDtail);
