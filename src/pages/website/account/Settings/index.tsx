import type { ILawyer } from '@/data-typings';
import type { ConnectState } from '@/models/connect';
import LawyerForm from '@/pages/system/lawyer/components/Form';
import { Button, Card, Result, Skeleton } from 'antd';
import { useCallback, useEffect } from 'react';
import type { Dispatch } from 'umi';
import { connect, useAccess, useModel } from 'umi';

interface IAccountSettingsProps {
  dispatch: Dispatch;
  detail: ILawyer;
  queryLoading: boolean;
  updateLoading: boolean;
}
const AccountSettings = ({
  dispatch,
  detail = {} as ILawyer,
  queryLoading,
}: IAccountSettingsProps) => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const access = useAccess();
  const currentUser = initialState?.currentUser;

  const queryDetail = useCallback(() => {
    if (currentUser && currentUser.id && access.isLawyer) {
      dispatch({
        type: 'lawyerModel/queryLawyerDetail',
        payload: { id: currentUser.id },
      });
    }
  }, [dispatch, currentUser, access]);

  useEffect(() => {
    queryDetail();
  }, [queryDetail]);

  /** 关闭登录框 */
  const openLoginModal = useCallback(() => {
    setInitialState({ ...initialState, loginModalVisible: true });
  }, [initialState, setInitialState]);

  if (!currentUser || !currentUser.id || !access.isLogin) {
    return (
      <Result
        title="尚未登录。请您登录后使用"
        extra={
          <Button type="primary" onClick={() => openLoginModal()}>
            马上登录
          </Button>
        }
      />
    );
  }

  if (!access.isLawyer) {
    return <Result title="无法修改个人信息" subTitle="如有需要，请联系系统管理员" />;
  }

  const renderContent = () => {
    if (queryLoading) {
      return <Skeleton active />;
    }
    if (!detail.id) {
      return <Result status="warning" title="不存在或已被删除" />;
    }
    return <LawyerForm detail={detail} entrance="website" onUpdateFinish={() => queryDetail()} />;
  };

  return <Card bordered={false}>{renderContent()}</Card>;
};

export default connect(({ loading: { effects }, lawyerModel: { detail } }: ConnectState) => ({
  detail,
  queryLoading: effects['lawyerModel/queryLawyerDetail'] || false,
}))(AccountSettings);
