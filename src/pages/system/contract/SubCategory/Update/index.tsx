import type { IContractSubCategory } from '@/data-typings';
import type { ConnectState } from '@/models/connect';
import { Card, Result, Skeleton } from 'antd';
import { useEffect } from 'react';
import type { Dispatch } from 'umi';
import { connect, useParams } from 'umi';
import Form from '../../components/SubCategoryForm';

interface IUpdateContractSubCategoryProps {
  dispatch: Dispatch;
  loading: boolean;
  subCategoryDetail: IContractSubCategory;
}
const UpdateContractSubCategory = ({
  dispatch,
  loading,
  subCategoryDetail = {} as IContractSubCategory,
}: IUpdateContractSubCategoryProps) => {
  const params: { id: string } = useParams();
  useEffect(() => {
    dispatch({
      type: 'contractModel/queryContractSubCategoryDetail',
      payload: {
        id: params.id,
      },
    });
  }, [dispatch, params.id]);

  useEffect(() => {
    dispatch({
      type: 'contractModel/updateState',
      payload: {
        subCategoryDetail: {},
      },
    });
  }, [dispatch]);

  const renderContent = () => {
    if (loading) {
      return <Skeleton active />;
    }
    if (!subCategoryDetail.id) {
      return <Result status="warning" title="不存在或已被删除" />;
    }
    return <Form detail={subCategoryDetail} />;
  };

  return <Card bordered={false}>{renderContent()}</Card>;
};

export default connect(({ loading, contractModel: { subCategoryDetail } }: ConnectState) => ({
  subCategoryDetail,
  loading: loading.effects['contractModel/queryContractSubCategoryDetail'] || false,
}))(UpdateContractSubCategory);
