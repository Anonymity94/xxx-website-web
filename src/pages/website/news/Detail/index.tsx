import type { INews } from '@/data-typings';
import PageLayout from '@/layouts/PageLayout';
import type { ConnectState } from '@/models/connect';
import { Card, Divider, Result, Skeleton, Typography } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import type { Dispatch } from 'umi';
import { connect, useParams } from 'umi';
import styles from './index.less';

const { Title } = Typography;

interface INewsDetailProps {
  dispatch: Dispatch;
  queryLoading: boolean;
  detail: INews;
}
const NewsDtail = ({ dispatch, queryLoading, detail = {} as INews }: INewsDetailProps) => {
  const [isReady, setIsReady] = useState(false);
  const { id }: { id: string } = useParams();
  useEffect(() => {
    dispatch({
      type: 'newsModel/queryNewsDetail',
      payload: { id },
    });

    return () => {
      dispatch({
        type: 'newsModel/updateState',
        payload: { detail: {} },
      });
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (!isReady) {
      setIsReady(true);
    }
  }, [isReady]);

  const renderContent = () => {
    if (!isReady || queryLoading) {
      return <Skeleton active />;
    }

    if (!detail.id) {
      return <Result status="info" title="资源不存在或已被删除" />;
    }

    return (
      <Typography className={styles['news-body']}>
        <Title>{detail.title}</Title>
        <div className={styles['news-header']}>
          <div>点击量：{detail.visitCount || 0}</div>
          <Divider type="vertical" />
          <div>发布时间：{moment(detail.createTime).format('YYYY-MM-DD HH:mm')}</div>
        </div>
        <div className={styles['news-profile']}>{detail.profile}</div>
        <div
          className={styles['news-content']}
          dangerouslySetInnerHTML={{ __html: detail.content }}
        ></div>
      </Typography>
    );
  };

  return (
    <PageLayout>
      <Card bordered={true} className={styles.news}>
        {renderContent()}
      </Card>
    </PageLayout>
  );
};

export default connect(({ loading: { effects }, newsModel: { detail } }: ConnectState) => ({
  queryLoading: effects['newsModel/queryNewsDetail'] || false,
  detail,
}))(NewsDtail);
