import type { IContractCategory } from '@/data-typings';
import type { ConnectState } from '@/models/connect';
import { Card, Result, Skeleton } from 'antd';
import { useEffect } from 'react';
import type { Dispatch } from 'umi';
import { connect, useParams } from 'umi';
import Form from '../../components/CategoryForm';

interface IUpdateContractCategoryProps {
  dispatch: Dispatch;
  loading: boolean;
  categoryDetail: IContractCategory;
}
const UpdateContractCategory = ({
  dispatch,
  loading,
  categoryDetail = {} as IContractCategory,
}: IUpdateContractCategoryProps) => {
  const params: { id: string } = useParams();
  useEffect(() => {
    dispatch({
      type: 'contractModel/queryContractCategoryDetail',
      payload: {
        id: params.id,
      },
    });
  }, [dispatch, params.id]);

  useEffect(() => {
    dispatch({
      type: 'contractModel/updateState',
      payload: {
        categoryDetail: {},
      },
    });
  }, [dispatch]);

  const renderContent = () => {
    if (loading) {
      return <Skeleton active />;
    }
    if (!categoryDetail.id) {
      return <Result status="warning" title="不存在或已被删除" />;
    }
    return <Form detail={categoryDetail} />;
  };

  return <Card bordered={false}>{renderContent()}</Card>;
};

export default connect(({ loading, contractModel: { categoryDetail } }: ConnectState) => ({
  categoryDetail,
  loading: loading.effects['contractModel/queryContractCategoryDetail'] || false,
}))(UpdateContractCategory);
