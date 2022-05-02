import { UPLOAD_PRIVATE_FILE_API } from '@/appConfig';
import type { IContract, IContractCategory, IContractSubCategory } from '@/data-typings';
import { EBoolean, EStatus } from '@/data-typings';
import type { ConnectState } from '@/models/connect';
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Select,
  Skeleton,
  Space,
  Upload,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import type { UploadChangeParam, UploadFile } from 'antd/es/upload/interface';
import { useEffect, useState } from 'react';
import type { Dispatch } from 'umi';
import { connect, history } from 'umi';

const uploadProps: UploadProps = {
  action: UPLOAD_PRIVATE_FILE_API,
  name: 'file',
  withCredentials: true,
  maxCount: 1,
  accept: '.doc,.docx',
};

interface IUploadFileValue {
  uid: string;
  url: string;
  name: string;
}

interface IContractFormProps {
  dispatch: Dispatch;
  detail?: IContract;
  categoryList?: IContractCategory[];
  subCategoryList?: IContractSubCategory[];
  contractList?: IContract[];
  queryLoading?: boolean;
  submittingLoading?: boolean;
}
const ContractForm = ({
  dispatch,
  detail = {} as IContract,
  categoryList = [],
  subCategoryList = [],
  contractList = [],
  queryLoading,
  submittingLoading,
}: IContractFormProps) => {
  const [form] = useForm();
  const [displaySubCategoryList, setDisplaySubCategory] = useState<IContractSubCategory[]>([]);

  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  // 上传组件中的合同文件
  const [uploadFileList] = useState<IUploadFileValue[]>(() => {
    return detail.filePath
      ? [
          {
            uid: detail.filePath,
            // 不让点击
            url: '',
            filePath: detail.filePath,
            name: detail.filePath,
          },
        ]
      : [];
  });
  // 合同的预览截图
  const [filePreviewImg, setFilePreviewImg] = useState<string>('');

  useEffect(() => {
    setFilePreviewImg(detail.filePreviewImg || '');
  }, [detail.filePreviewImg]);

  useEffect(() => {
    dispatch({
      type: 'contractModel/queryContractCategories',
      payload: {},
    });
    dispatch({
      type: 'contractModel/queryContractSubCategories',
      payload: {},
    });
    // dispatch({
    //   type: 'contractModel/queryContracts',
    //   payload: {},
    // });
  }, [dispatch]);

  useEffect(() => {
    setDisplaySubCategory(subCategoryList);
  }, [subCategoryList]);

  const goBack = () => {
    history.push('/system/contract/contract/list');
  };

  const handleCategoryChange = (categoryId: string) => {
    setDisplaySubCategory(subCategoryList.filter((item) => item.categoryId === categoryId));
    form.setFieldsValue({
      subcategoryId: undefined,
    });
  };

  const handUploadChange = (info: UploadChangeParam) => {
    const { file, fileList = [] } = info;
    const { status, error } = file;

    if (status === 'uploading') {
      setUploadLoading(true);
      return fileList;
    }

    setUploadLoading(false);

    if (status === 'error') {
      if (error?.status === 401) {
        message.error('上传失败。登录超时');
        history.push('/system/login');
        return [];
      }
      message.error('上传失败');
      return [];
    }

    if (Array.isArray(info)) {
      return info;
    }

    if (info && fileList) {
      // 取最新的一个
      const lastFileInfo: UploadFile<{
        filePath: string;
        filePreviewImg: string;
        status: 'success' | 'error';
      }> = fileList.slice(-1)[0];

      if (lastFileInfo.response?.status !== 'success') {
        return [];
      }

      const result = [
        {
          uid: lastFileInfo.uid,
          filePath: lastFileInfo.response?.filePath,
          url: '',
          name: lastFileInfo.response?.filePath,
        },
      ];

      // 更新预览图片
      setFilePreviewImg(lastFileInfo.response?.filePreviewImg || '');
      return result;
    }

    return [];
  };

  const handleFinish = (values: Record<string, any>) => {
    const postData = { ...values };

    // 兼容上传文件地址
    const { uploadFile = [] } = postData;
    if (!uploadFile || uploadFile.length === 0) {
      return;
    }
    const path: string = uploadFile[0].filePath;
    postData.filePath = path;
    delete postData.uploadFile;

    // 从 state 中获取预览截图
    postData.filePreviewImg = filePreviewImg;

    Modal.confirm({
      title: '确定保存吗？',
      onOk: () => {
        dispatch({
          type: 'contractModel/createOrUpdateContract',
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
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 16 }}
      layout="horizontal"
      scrollToFirstError
      initialValues={{ ...detail, uploadFile: uploadFileList }}
      onFinish={handleFinish}
    >
      <Form.Item label="ID" name="id" hidden>
        <Input />
      </Form.Item>
      <Form.Item
        label="合同名称"
        name="name"
        validateFirst
        rules={[
          { whitespace: true, required: true },
          { max: 32 },
          {
            validator: (_, value) => {
              // 重名检查
              if (!detail.id && contractList.find((item) => item.name.trim() === value.trim())) {
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
        <Select onChange={handleCategoryChange}>
          {categoryList.map((item) => (
            <Select.Option key={item.id} value={item.id}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="所属小类" name="subcategoryId" validateFirst rules={[{ required: true }]}>
        <Select>
          {displaySubCategoryList.map((item) => (
            <Select.Option key={item.id} value={item.id}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="uploadFile"
        label="合同文件"
        validateFirst
        getValueFromEvent={handUploadChange}
        rules={[{ required: true }]}
        valuePropName="fileList"
        extra="请上传 doc 或 docx 格式的合同文件"
      >
        <Upload
          {...uploadProps}
          showUploadList={{
            showDownloadIcon: false,
            showRemoveIcon: false,
          }}
        >
          {uploadLoading ? (
            <Button icon={<LoadingOutlined />}>{'上传中'}</Button>
          ) : (
            <Button icon={<UploadOutlined />}>{'选择文件'}</Button>
          )}
        </Upload>
      </Form.Item>
      <Form.Item
        label="合同简介"
        name="profile"
        validateFirst
        rules={[{ whitespace: true, required: true }, { max: 256 }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item
        label="合同来源"
        name="source"
        validateFirst
        rules={[{ whitespace: true, required: true }, { max: 256 }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item label="下载价格" required>
        <Form.Item noStyle label="下载价格" name="price" rules={[{ required: true }]}>
          <InputNumber min={0} precision={2} />
          {/* <InputNumber min={0} precision={0} /> */}
        </Form.Item>
        <span> 元/每次</span>
      </Form.Item>
      <Form.Item label="是否是热门合同" name="isHot" rules={[{ required: true }]}>
        <Radio.Group>
          <Radio value={EBoolean.True}>热门</Radio>
          <Radio value={EBoolean.False}>正常</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="状态" name="status" rules={[{ required: true }]}>
        <Radio.Group>
          <Radio value={EStatus.Open}>启用</Radio>
          <Radio value={EStatus.Closed}>禁用</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 4 }} name="action">
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
  ({
    loading: { effects },
    contractModel: { categoryList, subCategoryList, contractList },
  }: ConnectState) => ({
    categoryList,
    subCategoryList,
    contractList,
    queryLoading:
      effects['contractModel/queryContractCategories'] ||
      effects['contractModel/queryContractSubCategories'],
    submittingLoading: effects['contractModel/createOrUpdateContract'],
  }),
)(ContractForm);
