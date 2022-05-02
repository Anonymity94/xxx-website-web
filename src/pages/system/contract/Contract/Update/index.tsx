import type { IContract } from '@/data-typings';
import type { ConnectState } from '@/models/connect';
import { Card, Result, Skeleton } from 'antd';
import { useEffect } from 'react';
import type { Dispatch } from 'umi';
import { connect, useParams } from 'umi';
import Form from '../../components/ContractForm';

interface IUpdateContractProps {
  dispatch: Dispatch;
  loading: boolean;
  contractDetail: IContract;
}
const UpdateContract = ({
  dispatch,
  loading,
  contractDetail = {} as IContract,
}: IUpdateContractProps) => {
  const params: { id: string } = useParams();
  useEffect(() => {
    dispatch({
      type: 'contractModel/queryContractDetail',
      payload: {
        id: params.id,
      },
    });
  }, [dispatch, params.id]);

  useEffect(() => {
    dispatch({
      type: 'contractModel/updateState',
      payload: {
        contractDetail: {},
      },
    });
  }, [dispatch]);

  const renderContent = () => {
    if (loading) {
      return <Skeleton active />;
    }
    if (!contractDetail.id) {
      return <Result status="warning" title="不存在或已被删除" />;
    }
    return <Form detail={contractDetail} />;
  };

  return <Card bordered={false}>{renderContent()}</Card>;
};

export default connect(({ loading, contractModel: { contractDetail } }: ConnectState) => ({
  contractDetail,
  loading: loading.effects['contractModel/queryContractDetail'] || false,
}))(UpdateContract);
