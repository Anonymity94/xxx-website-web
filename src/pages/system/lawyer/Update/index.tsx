import type { ILawyer } from '@/data-typings';
import type { ConnectState } from '@/models/connect';
import { Card, Result, Skeleton } from 'antd';
import { useEffect } from 'react';
import type { Dispatch } from 'umi';
import { connect, useParams } from 'umi';
import Form from '../components/Form';

interface IUpdateLawyerProps {
  dispatch: Dispatch;
  loading: boolean;
  detail: ILawyer;
}
const UpdateLawyer = ({ dispatch, loading, detail = {} as ILawyer }: IUpdateLawyerProps) => {
  const params: { id: string } = useParams();
  useEffect(() => {
    dispatch({
      type: 'lawyerModel/queryLawyerDetail',
      payload: {
        id: params.id,
      },
    });
  }, [dispatch, params.id]);

  useEffect(() => {
    dispatch({
      type: 'lawyerModel/updateState',
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
    return <Form detail={detail} />;
  };

  return <Card bordered={false}>{renderContent()}</Card>;
};

export default connect(({ loading, lawyerModel: { detail } }: ConnectState) => ({
  detail,
  loading: loading.effects['lawyerModel/queryLawyerDetail'] || false,
}))(UpdateLawyer);
