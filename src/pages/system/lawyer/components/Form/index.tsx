import { UPLOAD_FILE_PATH_PREFIX, UPLOAD_FILE_API } from '@/appConfig';
import Editor from '@/components/Editor';
import type { ILawyer } from '@/data-typings';
import { EStatus } from '@/data-typings';
import type { ConnectState } from '@/models/connect';
import { passwordMsg, passwordReg, phoneReg, usernameMsg, usernameReg } from '@/utils/utils';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Upload,
} from 'antd';
import ImgCrop from 'antd-img-crop';
import type { UploadChangeParam, UploadProps } from 'antd/es/upload/interface';
import { useEffect, useMemo, useState } from 'react';
import type { Dispatch } from 'umi';
import { connect, history } from 'umi';
import { provinceList, getCityListByProvinceName } from '@/assets/geographic';

/** 内置的擅长领域 */
const DEFAULT_GOOD_AT_LIST = ['交通事故', '离婚纠纷'];
/** 内置的优势 */
const DEFAULT_ADVANTAGE_LIST = ['有团队', '高学历', '处理迅速', '主任律师'];

const uploadProps: UploadProps = {
  action: UPLOAD_FILE_API,
  name: 'file',
  listType: 'picture-card',
  showUploadList: false,
  withCredentials: true,
  accept: '.png,.jpg,.jpeg',
};

interface ILawyerFormProps {
  dispatch: Dispatch;
  detail?: ILawyer;
  submittingLoading?: boolean;

  /** 入口来源，是管理端还是官网 */
  entrance?: 'website' | 'system';
  onUpdateFinish?: () => void;
}
const LawyerForm = ({
  submittingLoading,
  detail = {} as ILawyer,
  dispatch,
  entrance = 'system',
  onUpdateFinish,
}: ILawyerFormProps) => {
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  const [imgUrl, setImgUrl] = useState<string>('');

  const [form] = Form.useForm();

  useEffect(() => {
    setImgUrl(detail.avatar);
  }, [detail.avatar]);

  /**
   *  是否来自管理员界面
   */
  const fromSystem = useMemo(() => {
    return entrance === 'system';
  }, [entrance]);

  const isUpdate = useMemo(() => {
    return !!detail.id;
  }, [detail?.id]);

  const goBack = () => {
    history.push('/system/user/lawyer/list');
  };

  const uploadButton = useMemo(() => {
    return <div>{uploadLoading ? <LoadingOutlined /> : <PlusOutlined />}</div>;
  }, [uploadLoading]);

  const handUploadChange = (info: UploadChangeParam) => {
    const {
      file: { status, error, response },
    } = info;
    setImgUrl('');
    if (status === 'uploading') {
      setUploadLoading(true);
      return;
    }
    setUploadLoading(false);

    if (status === 'error') {
      if (error?.status === 401) {
        message.error('上传失败。登录超时');
        history.push('/system/login');
        return;
      }
      message.error('上传失败');
      return;
    }

    if (status === 'done') {
      setImgUrl(response?.filePath);
    }
  };

  const handleProvinceChange = () => {
    form.setFieldsValue({
      city: undefined,
    });
  };

  const handleFinish = (values: Record<string, any>) => {
    const postData = { ...values };
    delete postData.passwordConfirm;
    postData.avatar = imgUrl;
    postData.goodAt = postData.goodAt.join(',');
    postData.advantage = postData.advantage.join(',');

    const api = fromSystem ? 'lawyerModel/createOrUpdateLawyer' : 'lawyerModel/updateLawyer';

    Modal.confirm({
      title: '确定保存吗？',
      onOk: () => {
        dispatch({
          type: api,
          payload: postData,
        }).then((success: boolean) => {
          if (success) {
            if (fromSystem) {
              // 来源于管理员
              goBack();
            } else if (onUpdateFinish) {
              onUpdateFinish();
            }
          }
        });
      },
    });
  };
  return (
    <Form
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 16 }}
      layout="horizontal"
      scrollToFirstError
      initialValues={{
        ...detail,
        password: undefined,
        goodAt: detail?.goodAt?.split(',') || [],
        advantage: detail?.advantage?.split(',') || [],
      }}
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
        name="avatar"
        label="头像"
        rules={[
          {
            validator() {
              if (!imgUrl) {
                return Promise.reject(new Error('请上传头像'));
              }
              return Promise.resolve();
            },
          },
        ]}
        extra="上传 png 或 jpg 格式的图片"
      >
        <ImgCrop rotate>
          <Upload {...uploadProps} onChange={handUploadChange}>
            {imgUrl ? (
              <img src={UPLOAD_FILE_PATH_PREFIX + imgUrl} alt="avatar" style={{ width: '100%' }} />
            ) : (
              uploadButton
            )}
          </Upload>
        </ImgCrop>
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
        label="排序序号"
        name="sortNumber"
        validateFirst
        rules={[{ required: true }]}
        extra="序号越大，表示优先级越高，展示排名越靠前"
      >
        <InputNumber
          disabled={!fromSystem}
          min={0}
          max={999999999}
          precision={0}
          style={{ width: 200 }}
        />
      </Form.Item>
      <Form.Item
        label="事务所名称"
        name="company"
        validateFirst
        rules={[{ whitespace: true, required: true }, { max: 100 }]}
      >
        <Input />
      </Form.Item>
      {/* name="geographic" */}
      <Form.Item label="所在省市" style={{ marginBottom: 0 }}>
        <Row gutter={10}>
          <Col span={8}>
            <Form.Item label="所在省份" name="province" validateFirst rules={[{ required: true }]}>
              <Select showSearch placeholder="选择所在省份" onChange={handleProvinceChange}>
                {provinceList.map((province) => (
                  <Select.Option key={province.id} value={province.name}>
                    {province.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, curValues) => prevValues.province !== curValues.province}
            >
              {({ getFieldValue }) => {
                const provinceName = getFieldValue('province');
                const cityList = provinceName ? getCityListByProvinceName(provinceName) : [];

                return (
                  <Form.Item
                    label="所在城市"
                    name="city"
                    validateFirst
                    rules={[{ required: true }]}
                  >
                    <Select showSearch placeholder="选择所在省份">
                      {cityList.map((city) => (
                        <Select.Option key={city.id} value={city.name}>
                          {city.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                );
              }}
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>
      <Form.Item
        label="事务所地址"
        name="location"
        validateFirst
        rules={[{ whitespace: true, required: true }, { max: 100 }]}
      >
        <Input.TextArea rows={2} />
      </Form.Item>
      <Form.Item
        label="职称"
        name="title"
        validateFirst
        rules={[{ whitespace: true, required: true }, { max: 100 }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="擅长领域"
        name="goodAt"
        validateFirst
        rules={[{ required: true }]}
        extra="选择标签。也可以输入新的标签，回车确认"
      >
        <Select mode="tags" style={{ width: '100%' }} placeholder="擅长领域关键字">
          {DEFAULT_GOOD_AT_LIST.map((tag) => (
            <Select.Option key={tag} value={tag}>
              {tag}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="律师优势"
        name="advantage"
        rules={[{ required: true }]}
        extra="选择标签。也可以输入新的标签，回车确认"
        // extra="输入关键字，多个关键字以半角逗号分隔。例如：有团队,高学历,处理迅速,主任律师"
      >
        <Select mode="tags" style={{ width: '100%' }} placeholder="擅长优势关键字">
          {DEFAULT_ADVANTAGE_LIST.map((tag) => (
            <Select.Option key={tag} value={tag}>
              {tag}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="个人简介"
        name="profile"
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
      <Form.Item label="接单状态" name="orderStatus" rules={[{ required: true }]}>
        <Radio.Group>
          <Radio value={EStatus.Open}>启用</Radio>
          <Radio value={EStatus.Closed}>禁用</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="咨询价格" required>
        <Form.Item name="orderPrice" label="咨询价格" noStyle rules={[{ required: true }]}>
          <InputNumber disabled={!fromSystem} min={0} precision={2} />
        </Form.Item>
        <span> 元/每次</span>
      </Form.Item>

      <Form.Item label="个人档案" name="archive" rules={[{ required: true }]}>
        <Editor />
      </Form.Item>
      <Form.Item label="服务范围描述" name="serviceScope" rules={[{ required: true }]}>
        <Editor />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 4 }}>
        <Space>
          <Button type="primary" htmlType="submit" loading={submittingLoading}>
            保存
          </Button>
          {fromSystem && (
            <Button loading={submittingLoading} onClick={goBack}>
              取消
            </Button>
          )}
        </Space>
      </Form.Item>
    </Form>
  );
};

export default connect(({ loading: { effects } }: ConnectState) => ({
  submittingLoading:
    effects['lawyerModel/createOrUpdateLawyer'] || effects['lawyerModel/updateLawyer'],
}))(LawyerForm);
