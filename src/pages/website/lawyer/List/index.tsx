import { OPEN_API_PREFIX, UPLOAD_FILE_PATH_PREFIX } from '@/appConfig';
import { getCityListByProvinceName, provinceList } from '@/assets/geographic';
import IconText from '@/components/IconText';
import type {
  IAjaxResponseFactory,
  ILawyer,
  ILawyerQueryParams,
  IPageFactory,
} from '@/data-typings';
import { EStatus } from '@/data-typings';
import PageLayout from '@/layouts/PageLayout';
import ajax from '@/utils/ajax';
import { EnvironmentOutlined } from '@ant-design/icons';
import type { ProDescriptionsProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import ProList from '@ant-design/pro-list';
import type { TablePaginationConfig } from 'antd';
import { Button, Card, Col, Form, Input, Pagination, Rate, Row, Select, Space, Tag } from 'antd';
import { stringify } from 'querystring';
import { useEffect, useRef, useState } from 'react';
import { history, useAccess } from 'umi';
import type { IPayModalRefProps } from '../../PayModal';
import PayModal from '../../PayModal';
import Icon from '../components/Icon';
import styles from './index.less';

const descriptionValues: ProDescriptionsProps<ILawyer> = {
  column: 2,
  columns: [
    {
      title: '律所',
      dataIndex: 'company',
    },
    {
      title: '案例',
      dataIndex: 'caseCount',
      render: (value) => `${value} 起`,
    },
    {
      title: '',
      dataIndex: 'location',
      render: (value, row) => (
        <>
          <IconText
            icon={EnvironmentOutlined}
            text={`${row.province || ''}${row.city ? ` - ${row.city}` : ''}`}
          />
        </>
      ),
    },
  ],
};

export default () => {
  const access = useAccess();
  const [form] = Form.useForm();
  const payModalRef = useRef<IPayModalRefProps>();

  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<ILawyer[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    pageSize: 20,
    current: 1,
    total: 0,
  });

  const handleProvinceChange = () => {
    form.setFieldsValue({
      city: undefined,
    });
  };

  const queryData = async (params?: Partial<ILawyerQueryParams>) => {
    const pageSize = params?.size || pagination!.pageSize;
    const current = params?.page || pagination!.current;
    const fromValue = form.getFieldsValue();
    const newParams = { size: pageSize, page: current! - 1, ...fromValue, status: EStatus.Open };
    setLoading(true);
    const { success, result } = (await ajax(
      `${OPEN_API_PREFIX}/user/lawyers?${stringify(newParams)}`,
    )) as IAjaxResponseFactory<IPageFactory<ILawyer>>;
    setLoading(false);
    if (!success) {
      setList([]);
      return;
    }

    setList(result.content);
    setPagination({
      current: result.number + 1,
      pageSize: result.size,
      total: result.totalElements,
    });
  };

  useEffect(() => {
    queryData();
  }, []);

  const handlePageChange = (page: number, pageSize?: number) => {
    queryData({
      page,
      size: pageSize,
    });
  };

  const handleSubmit = () => {
    queryData({
      page: 1,
    });
  };

  const handleReset = () => {
    form.resetFields();
    queryData({
      page: 1,
    });
  };

  return (
    <PageLayout>
      <Form form={form} onFinish={handleSubmit}>
        <Row gutter={10}>
          <Col span={6}>
            <Form.Item label="所在省份" name="province">
              <Select showSearch placeholder="选择所在省份" onChange={handleProvinceChange}>
                {provinceList.map((province) => (
                  <Select.Option key={province.id} value={province.name}>
                    {province.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, curValues) => prevValues.province !== curValues.province}
            >
              {({ getFieldValue }) => {
                const provinceName = getFieldValue('province');
                const cityList = provinceName ? getCityListByProvinceName(provinceName) : [];

                return (
                  <Form.Item label="所在城市" name="city" validateFirst>
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
          <Col span={6}>
            <Form.Item label="律师姓名" name="fullName">
              <Input placeholder="律师姓名" />
            </Form.Item>
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            <Form.Item>
              <Space>
                <Button htmlType="button" onClick={handleReset}>
                  重置
                </Button>
                <Button type="primary" htmlType="submit">
                  搜索
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Card bordered>
        <ProList<ILawyer>
          className={styles.list}
          itemLayout="vertical"
          rowKey="id"
          toolBarRender={false}
          split
          loading={loading}
          dataSource={list}
          pagination={false}
          metas={{
            title: {
              render: (_, row) => {
                const { fullName, advantage } = row;
                const advantageKeyworkList = advantage?.split(',') || [];
                return (
                  <Space>
                    <span>{fullName}</span>
                    {advantageKeyworkList.map((k) => (
                      <Tag key={k} color="#5BD8A6">
                        {k}
                      </Tag>
                    ))}
                  </Space>
                );
              },
            },
            avatar: {
              render: (_, row) => {
                return <img className={styles.avatar} src={UPLOAD_FILE_PATH_PREFIX + row.avatar} />;
              },
            },
            subTitle: {
              render: (_, row) => {
                const { goodAt } = row;
                const goodAtKeyworkList = goodAt?.split(',') || [];
                return (
                  <Space size={0}>
                    擅长：
                    {goodAtKeyworkList.map((k) => (
                      <Tag key={k} color="blue">
                        {k}
                      </Tag>
                    ))}
                  </Space>
                );
              },
            },
            description: {
              render: (_, row) => {
                return (
                  <>
                    <ProDescriptions<ILawyer>
                      {...descriptionValues}
                      size="small"
                      dataSource={row}
                    />
                    <Space>
                      <span>
                        <Rate disabled defaultValue={row.scoreAvg} />{' '}
                        <span className={styles.scoreNumber}>{row.scoreAvg}</span>
                      </span>
                      <span>
                        <Icon type="real-name" />
                      </span>
                      <span>
                        <Icon type="qualification" />
                      </span>
                    </Space>
                  </>
                );
              },
            },
            extra: {
              render: (_, row) => {
                const isOpen = row.orderStatus === EStatus.Open;
                return (
                  <Space direction="vertical">
                    <Button type="primary" onClick={() => history.push(`/web/lawyer/${row.id}`)}>
                      律师详情
                    </Button>
                    <Button
                      type="primary"
                      disabled={!isOpen || (!access.isUser && !access.isCompanyUser)}
                      onClick={() => payModalRef.current?.handleLawyerChat(row)}
                    >
                      在线咨询
                    </Button>
                  </Space>
                );
              },
            },
          }}
        />
        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
          <Pagination
            {...pagination}
            onChange={handlePageChange}
            showSizeChanger
            showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`}
          />
        </div>
      </Card>
      <PayModal ref={payModalRef} />
    </PageLayout>
  );
};
