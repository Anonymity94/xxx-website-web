import type { IContractCategory, IContractSubCategory } from '@/data-typings';
import type { ConnectState } from '@/models/connect';
import { Button, Form, Input, Modal, Select, Skeleton, Space } from 'antd';
import { useEffect } from 'react';
import type { Dispatch } from 'umi';
import { connect, history } from 'umi';

interface IContractSubCategoryFormProps {
  dispatch: Dispatch;
  detail?: IContractSubCategory;
  categoryList?: IContractCategory[];
  subCategoryList?: IContractSubCategory[];
  queryLoading?: boolean;
  submittingLoading?: boolean;
}
const ContractSubCategoryForm = ({
  dispatch,
  detail = {} as IContractSubCategory,
  categoryList = [],
  subCategoryList = [],
  queryLoading,
  submittingLoading,
}: IContractSubCategoryFormProps) => {
  useEffect(() => {
    dispatch({
      type: 'contractModel/queryContractCategories',
      payload: {},
    });
    dispatch({
      type: 'contractModel/queryContractSubCategories',
      payload: {},
    });
  }, [dispatch]);

  const goBack = () => {
    history.push('/system/contract/sub-category/list');
  };

  const handleFinish = (values: Record<string, any>) => {
    const postData = { ...values };
    Modal.confirm({
      title: '确定保存吗？',
      onOk: () => {
        dispatch({
          type: 'contractModel/createOrUpdateContractSubCategory',
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
        label="小类名称"
        name="name"
        validateFirst
        rules={[
          { whitespace: true, required: true },
          { max: 32 },
          {
            validator: (_, value) => {
              // 重名检查
              if (subCategoryList.find((item) => item.name.trim() === value.trim())) {
                return Promise.reject(new Error('名称已存在!'));
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="所属大类" name="categoryId" validateFirst rules={[{ required: true }]}>
        <Select>
          {categoryList.map((item) => (
            <Select.Option key={item.id} value={item.id}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
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
  ({ loading: { effects }, contractModel: { categoryList, subCategoryList } }: ConnectState) => ({
    categoryList,
    subCategoryList,
    queryLoading:
      effects['contractModel/queryContractCategories'] ||
      effects['contractModel/queryContractSubCategories'],
    submittingLoading: effects['contractModel/createOrUpdateContractSubCategory'],
  }),
)(ContractSubCategoryForm);
