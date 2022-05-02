import type { IContractCategory } from '@/data-typings';
import type { ConnectState } from '@/models/connect';
import { Button, Form, Input, Modal, Skeleton, Space } from 'antd';
import { useEffect } from 'react';
import type { Dispatch } from 'umi';
import { connect, history } from 'umi';

interface IContractCategoryFormProps {
  dispatch: Dispatch;
  detail?: IContractCategory;
  categoryList?: IContractCategory[];
  queryLoading?: boolean;
  submittingLoading?: boolean;
}
const ContractCategoryForm = ({
  dispatch,
  detail = {} as IContractCategory,
  categoryList = [],
  queryLoading,
  submittingLoading,
}: IContractCategoryFormProps) => {
  useEffect(() => {
    dispatch({
      type: 'contractModel/queryContractCategories',
      payload: {},
    });
  }, [dispatch]);

  const goBack = () => {
    history.push('/system/contract/category/list');
  };

  const handleFinish = (values: Record<string, any>) => {
    const postData = { ...values };
    Modal.confirm({
      title: '确定保存吗？',
      onOk: () => {
        dispatch({
          type: 'contractModel/createOrUpdateContractCategory',
          payload: postData,
        }).then((success: boolean) => {
          if (success) {
            goBack();
          }
        });
      },
    });
  };

  if (queryLoading) {
    return <Skeleton active />;
  }

  return (
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 16 }}
      layout="horizontal"
      scrollToFirstError
      initialValues={{ ...detail }}
      onFinish={handleFinish}
    >
      <Form.Item label="ID" name="id" hidden>
        <Input />
      </Form.Item>
      <Form.Item
        label="大类名称"
        name="name"
        validateFirst
        rules={[
          { whitespace: true, required: true },
          { max: 32 },
          {
            validator: (_, value) => {
              // 重名检查
              if (categoryList.find((item) => item.name.trim() === value.trim())) {
                return Promise.reject(new Error('名称已存在!'));
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="备注"
        name="description"
        validateFirst
        rules={[{ whitespace: true, required: false }, { max: 256 }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 4 }}>
        <Space>
          <Button type="primary" htmlType="submit" loading={submittingLoading}>
            保存
          </Button>
          <Button loading={submittingLoading} onClick={goBack}>
            取消
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default connect(
  ({ loading: { effects }, contractModel: { categoryList } }: ConnectState) => ({
    categoryList,
    queryLoading: effects['contractModel/queryContractCategories'],
    submittingLoading: effects['contractModel/createOrUpdateContractCategory'],
  }),
)(ContractCategoryForm);
