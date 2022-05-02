import Editor from '@/components/Editor';
import type { ILegalAffairsIntroduction } from '@/data-typings';
import { queryLegalAffairsIntroduction, updateLegalAffairsIntroduction } from '@/services';
import { Button, Card, Form, Input, message, Modal, Skeleton, Space } from 'antd';
import { useEffect, useState } from 'react';
import { history } from 'umi';

const LegalAffairsIntroduction = () => {
  const [form] = Form.useForm();
  const [queryLoading, setQueryLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [introductionDetail, setIntroductionDetail] = useState({} as ILegalAffairsIntroduction);

  const queryIntroduction = async () => {
    setQueryLoading(true);
    const { success, result } = await queryLegalAffairsIntroduction();

    if (success && Array.isArray(result) && result.length > 0) {
      const detail = result[0];
      setIntroductionDetail(detail);
    }
    if (!success) {
      message.error('获取页面内容失败');
    }

    setQueryLoading(false);
  };

  useEffect(() => {
    queryIntroduction();
  }, []);

  const handleFinish = (values: ILegalAffairsIntroduction) => {
    Modal.confirm({
      title: '确定保存吗？',
      onOk: () => {
        setSubmitLoading(true);
        updateLegalAffairsIntroduction(values).then((success) => {
          setSubmitLoading(false);
          if (success) {
            queryIntroduction();
          } else {
            message.error('保存失败');
          }
        });
      },
    });
  };

  if (queryLoading) {
    return (
      <Card bordered={false}>
        <Skeleton active />
      </Card>
    );
  }

  return (
    <Card bordered={false}>
      <Form
        form={form}
        labelCol={{ span: 0 }}
        wrapperCol={{ span: 24 }}
        layout="horizontal"
        scrollToFirstError
        initialValues={{ id: introductionDetail.id, introduction: introductionDetail.introduction }}
        onFinish={handleFinish}
      >
        <Form.Item
          name="id"
          hidden
          rules={[{ required: false, message: '请输入共享法务页面内容ID' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="introduction"
          rules={[{ required: true, message: '请输入共享法务页面内容' }]}
        >
          <Editor />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={submitLoading}>
              保存
            </Button>
            <Button loading={submitLoading} onClick={() => history.goBack()}>
              取消
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default LegalAffairsIntroduction;
