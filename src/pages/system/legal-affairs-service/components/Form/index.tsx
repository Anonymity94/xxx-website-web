import type { ILegalAffairsService } from '@/data-typings';
import type { ConnectState } from '@/models/connect';
import { Button, Form, Input, InputNumber, Modal, Space } from 'antd';
import type { Dispatch } from 'umi';
import { connect, history } from 'umi';

interface ILegalAffairsServiceFormProps {
  dispatch: Dispatch;
  detail?: ILegalAffairsService;
  submittingLoading?: boolean;
}
const LegalAffairsServiceForm = ({
  submittingLoading,
  detail = {} as ILegalAffairsService,
  dispatch,
}: ILegalAffairsServiceFormProps) => {
  const goBack = () => {
    history.push('/system/legal-affairs/service/list');
  };

  const handleFinish = (values: Record<string, any>) => {
    const postData = { ...values };

    Modal.confirm({
      title: '确定保存吗？',
      onOk: () => {
        dispatch({
          type: 'legalAffairsServiceModel/createOrUpdateLegalAffairsService',
          payload: postData,
        }).then((success: boolean) => {
          if (success) {
            goBack();
          }
        });
      },
    });
  };

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
        label="套餐名称"
        name="name"
        validateFirst
        rules={[{ required: true, whitespace: true, message: '请输入套餐名称' }, { max: 30 }]}
      >
        <Input placeholder="套餐名称" />
      </Form.Item>
      <Form.Item
        label="套餐价格"
        name="price"
        validateFirst
        rules={[{ required: true, message: '请输入套餐价格' }]}
      >
        <InputNumber min={0} precision={2} placeholder="套餐价格" style={{ width: 200 }} />
      </Form.Item>
      <Form.Item
        label="订单编号前缀"
        name="prefix"
        rules={[
          { required: true, whitespace: true, message: '请输入订单编号前缀' },
          {
            pattern: /^[a-zA-Z]{1,6}$/,
            message: '只允许输入大小写字母；至少1位，至多6位',
          },
        ]}
      >
        <Input placeholder="订单编号前缀" max={6} style={{ width: 200 }} />
      </Form.Item>
      <Form.Item
        label="套餐描述"
        name="description"
        rules={[{ required: false, whitespace: true, message: '请输入套餐描述' }, { max: 256 }]}
      >
        <Input.TextArea rows={3} placeholder="套餐描述" />
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

export default connect(({ loading }: ConnectState) => ({
  submittingLoading: loading.effects['legalAffairsServiceModel/createOrUpdateLegalAffairsService'],
}))(LegalAffairsServiceForm);
