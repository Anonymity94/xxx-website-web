import type { INews } from '@/data-typings';
import type { ConnectState } from '@/models/connect';
import { Card, Result, Skeleton } from 'antd';
import { useEffect } from 'react';
import type { Dispatch } from 'umi';
import { connect, useParams } from 'umi';
import NewsForm from '../components/Form';

interface IUpdateNewsProps {
  dispatch: Dispatch;
  loading: boolean;
  detail: INews;
}
const UpdateNews = ({ dispatch, loading, detail = {} as INews }: IUpdateNewsProps) => {
  const params: { id: string } = useParams();
  useEffect(() => {
    dispatch({
      type: 'newsModel/queryNewsDetail',
      payload: {
        id: params.id,
      },
    });
  }, [dispatch, params.id]);

  useEffect(() => {
    dispatch({
      type: 'newsModel/updateState',
      payload: {
        detail: {},
      },
    });
  }, [dispatch]);

  const renderContent = () => {
    if (loading) {
      return <Skeleton active />;
    }
    if (!detail.id) {
      return <Result status="warning" title="不存在或已被删除" />;
    }
    return <NewsForm detail={detail} />;
  };

  return <Card bordered={false}>{renderContent()}</Card>;
};

export default connect(({ loading, newsModel: { detail } }: ConnectState) => ({
  detail,
  loading: loading.effects['newsModel/queryNewsDetail'] || false,
}))(UpdateNews);
