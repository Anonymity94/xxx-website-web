import type { ICustomerService } from '@/data-typings';
import { EStatus } from '@/data-typings';
import type { ConnectState } from '@/models/connect';
import { passwordMsg, passwordReg, phoneReg, usernameMsg, usernameReg } from '@/utils/utils';
import { Button, Form, Input, Modal, Radio, Space } from 'antd';
import { useMemo } from 'react';
import type { Dispatch } from 'umi';
import { connect, history } from 'umi';

interface ICustomerServiceFormProps {
  dispatch: Dispatch;
  detail?: ICustomerService;
  submittingLoading?: boolean;
}
const CustomerServiceForm = ({
  submittingLoading,
  detail = {} as ICustomerService,
  dispatch,
}: ICustomerServiceFormProps) => {
  const isUpdate = useMemo(() => {
    return !!detail.id;
  }, [detail?.id]);

  const goBack = () => {
    history.push('/system/user/customer-service/list');
  };

  const handleFinish = (values: Record<string, any>) => {
    const postData = { ...values };
    delete postData.passwordConfirm;

    Modal.confirm({
      title: '确定保存吗？',
      onOk: () => {
        dispatch({
          type: 'customerServiceModel/createOrUpdateCustomerService',
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
      initialValues={{ ...detail, password: undefined }}
      onFinish={handleFinish}
    >
      <Form.Item label="ID" name="id" hidden>
        <Input />
      </Form.Item>
      <Form.Item
        label="登录名"
        name="loginName"
        validateFirst
        rules={[
          { whitespace: true, required: true },
          { pattern: usernameReg, message: usernameMsg },
        ]}
        extra={usernameMsg}
      >
        <Input disabled={isUpdate} />
      </Form.Item>
      <Form.Item
        label="用户名"
        name="fullName"
        validateFirst
        rules={[{ whitespace: true, required: true }, { max: 32 }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="手机号码"
        name="telephone"
        validateFirst
        rules={[
          { whitespace: true, required: true },
          { pattern: phoneReg, message: '手机号码格式不正确' },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="密码"
        name="password"
        validateFirst
        rules={[
          { whitespace: true, required: !isUpdate },
          { pattern: passwordReg, message: passwordMsg },
        ]}
        extra={isUpdate ? '不填写表示不修改' : passwordMsg}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        label="确认密码"
        name="passwordConfirm"
        dependencies={['password']}
        validateFirst
        rules={[
          { whitespace: true, required: !isUpdate },
          { pattern: passwordReg, message: passwordMsg },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('两次密码不匹配!'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item label="状态" name="status" rules={[{ required: true }]}>
        <Radio.Group>
          <Radio value={EStatus.Open}>启用</Radio>
          <Radio value={EStatus.Closed}>禁用</Radio>
        </Radio.Group>
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

export default connect(({ loading }: ConnectState) => ({
  submittingLoading: loading.effects['customerServiceModel/createOrUpdateCustomerService'],
}))(CustomerServiceForm);
