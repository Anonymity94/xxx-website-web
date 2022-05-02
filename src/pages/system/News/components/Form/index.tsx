import Editor from '@/components/Editor';
import type { INews } from '@/data-typings';
import { EBoolean, EStatus } from '@/data-typings';
import type { ConnectState } from '@/models/connect';
import { Button, Form, Input, Modal, Radio, Space } from 'antd';
import type { Dispatch } from 'umi';
import { connect, history } from 'umi';

interface INewsFormProps {
  dispatch: Dispatch;
  detail?: INews;
  submittingLoading?: boolean;
}
const NewsForm = ({ submittingLoading, detail = {} as INews, dispatch }: INewsFormProps) => {
  const goBack = () => {
    history.push('/system/news/list');
  };

  const handleFinish = (values: Record<string, any>) => {
    Modal.confirm({
      title: '确定保存吗？',
      onOk: () => {
        dispatch({
          type: 'newsModel/createOrUpdateNews',
          payload: values,
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
        label="标题"
        name="title"
        validateFirst
        rules={[{ whitespace: true, required: true }, { max: 60 }]}
      >
        <Input />
      </Form.Item>
      {/* TODO: 背景图 */}
      <Form.Item label="背景图" name="coverImgs" hidden>
        <Input />
      </Form.Item>
      <Form.Item
        label="新闻简介"
        name="profile"
        validateFirst
        rules={[{ whitespace: true, required: true }, { max: 256 }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item label="状态" name="status" rules={[{ required: true }]}>
        <Radio.Group>
          <Radio value={EStatus.Open}>启用</Radio>
          <Radio value={EStatus.Closed}>禁用</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="是否置顶" name="isTop" rules={[{ required: true }]}>
        <Radio.Group>
          <Radio value={EBoolean.True}>置顶</Radio>
          <Radio value={EBoolean.False}>不置顶</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item label="内容" name="content" rules={[{ required: true }]}>
        <Editor />
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
  submittingLoading: loading.effects['newsModel/createOrUpdateNews'],
}))(NewsForm);
