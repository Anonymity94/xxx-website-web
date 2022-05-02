import { UPLOAD_FILE_PATH_PREFIX } from '@/appConfig';
import IconText from '@/components/IconText';
import type { IContract, ILawyer, INews } from '@/data-typings';
import PageLayout from '@/layouts/PageLayout';
import type { ConnectState } from '@/models/connect';
import {
  ArrowRightOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  EyeOutlined,
  FireFilled,
} from '@ant-design/icons';
import ProList from '@ant-design/pro-list';
import { Button, Card, Col, Empty, Row, Space, Spin, Typography } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef } from 'react';
import type { Dispatch } from 'umi';
import { connect, history } from 'umi';
import type { IPayModalRefProps } from '../PayModal';
import PayModal from '../PayModal';
import styles from './index.less';

interface IHomeProps {
  dispatch: Dispatch;

  lawyerLoading?: boolean;
  newsLoading?: boolean;
  contractLoading?: boolean;
  hotLawyerList: ILawyer[];
  hotNewsList: INews[];
  hotContractList: IContract[];
}
const Home = ({
  dispatch,

  lawyerLoading,
  newsLoading,
  contractLoading,
  hotLawyerList,
  hotNewsList,
  hotContractList,
}: IHomeProps) => {
  const payModalRef = useRef<IPayModalRefProps>();

  useEffect(() => {
    // 律师
    dispatch({
      type: 'lawyerModel/queryHotLawyers',
      payload: {
        count: 8,
      },
    });
    // 热门合同
    dispatch({
      type: 'contractModel/queryHotContracts',
      payload: {
        count: 50,
      },
    });
    // 新闻
    dispatch({
      type: 'newsModel/queryHotNews',
      payload: {
        count: 10,
      },
    });
  }, [dispatch]);

  return (
    <PageLayout
      showBanner={false}
      showBreadcrumb={false}
      headerRender={() => (
        <section className={styles['banner-wrap']}>
          <div className={styles['banner-page']}>
            <span>公司名称公司名称公司名称公司名称公司名称</span>
          </div>
        </section>
      )}
    >
      <div className={styles.home}>
        <section>
          <div className={styles['header-wrap']}>
            <div className={styles['header-title']}>热门合同</div>
            <span></span>
          </div>
          <Spin spinning={contractLoading}>
            <Row gutter={10}>
              {hotContractList.length === 0 ? (
                <Col span={24}>
                  <Empty />
                </Col>
              ) : (
                <Col span={24}>
                  <ProList<IContract>
                    dataSource={hotContractList}
                    itemLayout="vertical"
                    rowKey="id"
                    bordered
                    split
                    pagination={{ pageSize: 10, hideOnSinglePage: true }}
                    metas={{
                      title: {
                        render: (_, row) => {
                          return (
                            <span onClick={() => history.push(`/web/contract/${row.id}`)}>
                              {row.name}{' '}
                              {row.isHot ? <FireFilled style={{ color: '#ff5722' }} /> : ''}
                            </span>
                          );
                        },
                      },
                      description: {
                        render: (_, row) => {
                          return (
                            <>
                              <Typography.Paragraph ellipsis={{ rows: 2 }}>
                                {row.profile}
                              </Typography.Paragraph>
                            </>
                          );
                        },
                      },
                      extra: {
                        render: (_, row) => {
                          return (
                            <Space style={{ fontSize: 14 }} size="middle">
                              <IconText
                                icon={EyeOutlined}
                                text={`${row.visitCount || 0} 次阅读`}
                                key="visit-count"
                              />
                              <IconText
                                icon={DownloadOutlined}
                                text={`${row.downloadCount || 0} 次下载`}
                                key="download-count"
                              />

                              <Button
                                type="primary"
                                icon={<DownloadOutlined />}
                                key="download"
                                onClick={() => {
                                  payModalRef?.current?.handleDownload(row);
                                }}
                              >
                                下载全文
                              </Button>
                            </Space>
                          );
                        },
                      },
                    }}
                  />
                  <div style={{ textAlign: 'center' }}>
                    <Button type="primary" onClick={() => history.push('/web/contract/list')}>
                      查看更多合同 <ArrowRightOutlined />
                    </Button>
                  </div>
                </Col>
              )}
            </Row>
          </Spin>
        </section>

        <section>
          <div className={styles['header-wrap']}>
            <div className={styles['header-title']}>专业律师</div>
            <span></span>
          </div>
          <Spin spinning={lawyerLoading}>
            <Row gutter={10}>
              {hotLawyerList.length === 0 ? (
                <Col span={24}>
                  <Empty />
                </Col>
              ) : (
                <>
                  {hotLawyerList.map((lawyer) => (
                    <Col
                      xs={{ span: 24 }}
                      sm={12}
                      md={{ span: 6 }}
                      key={lawyer.id}
                      style={{ marginBottom: 10 }}
                    >
                      <Card
                        hoverable
                        cover={
                          <img
                            alt={lawyer.fullName}
                            className={styles.avatar}
                            height={150}
                            src={UPLOAD_FILE_PATH_PREFIX + lawyer.avatar}
                          />
                        }
                        onClick={() => history.push(`/web/lawyer/${lawyer.id}`)}
                        size="small"
                      >
                        <Card.Meta
                          title={lawyer.fullName}
                          description={
                            <div className={styles['lawyer-info']}>
                              <p>{lawyer.title}</p>
                              <p>律所：{lawyer.company}</p>
                              <p>擅长领域：{lawyer.goodAt}</p>
                            </div>
                          }
                        />
                      </Card>
                    </Col>
                  ))}
                </>
              )}
            </Row>
          </Spin>
        </section>

        <section>
          <div className={styles['header-wrap']}>
            <div className={styles['header-title']}>新闻咨询</div>
            <span></span>
          </div>
          <Spin spinning={newsLoading}>
            <Row gutter={10}>
              {hotNewsList.length === 0 ? (
                <Col span={24}>
                  <Empty />
                </Col>
              ) : (
                <Col span={24}>
                  <ProList<INews>
                    dataSource={hotNewsList}
                    itemLayout="vertical"
                    rowKey="id"
                    bordered
                    className={styles.newsList}
                    split
                    metas={{
                      title: {
                        render: (_, row) => {
                          return (
                            <span onClick={() => history.push(`/web/news/${row.id}`)}>
                              {row.title}
                            </span>
                          );
                        },
                      },
                      description: {
                        render: (_, row) => {
                          return (
                            <>
                              <Typography.Paragraph ellipsis={{ rows: 2 }}>
                                {row.profile}
                              </Typography.Paragraph>
                            </>
                          );
                        },
                      },
                      actions: {
                        render: (_, row) => {
                          return (
                            <Space size="middle" style={{ fontSize: 14 }}>
                              <IconText
                                icon={EyeOutlined}
                                text={`${row.visitCount || 0} 次阅读`}
                                key="eye-o"
                              />
                              <IconText
                                icon={ClockCircleOutlined}
                                text={`${moment(row.createTime).format('YYYY-MM-DD HH:mm')}`}
                                key="eye-o"
                              />
                            </Space>
                          );
                        },
                      },
                    }}
                  />
                </Col>
              )}
            </Row>
          </Spin>
        </section>
        <section className={styles.about}>
          <div className={styles['header-wrap']}>
            <div className={styles['header-title']}>公司简介</div>
            <span></span>
          </div>

          <Row gutter={10}>
            <Col xs={{ span: 24 }} md={{ span: 12 }}>
              <h1>关于我们</h1>
              <div className={styles.text}>
                公司简介公司简介公司简介公司简介公司简介公司简介公司简介公司简介公司简介公司简介公司简介公司简介公司简介公司简介公司简介公司简介公司简介公司简介公司简介公司简介公司简介公司简介公司简介公司简介
              </div>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 12 }}>
              <div className={styles.bg} />
            </Col>
          </Row>
        </section>
        {/* <section>
          <Row gutter={10}>
            <Col xs={{ span: 24 }} md={{ span: 8 }}>
              <Card hoverable cover={<img alt="example" height={150} src="" />}>
                <Card.Meta title="企业愿景" description="描述信息" />
              </Card>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 8 }}>
              <Card hoverable cover={<img height={150} alt="example" />}>
                <Card.Meta title="企业理念" description="描述信息" />
              </Card>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 8 }}>
              <Card hoverable cover={<img height={150} alt="example" />}>
                <Card.Meta title="企业价值观" description="描述信息" />
              </Card>
            </Col>
          </Row>
        </section> */}
      </div>
      <PayModal ref={payModalRef} />
    </PageLayout>
  );
};

export default connect(
  ({
    loading: { effects },
    lawyerModel: { hotLawyerList },
    newsModel: { hotNewsList },
    contractModel: { hotContractList },
  }: ConnectState) => ({
    lawyerLoading: effects['lawyerModel/queryHotLawyers'],
    newsLoading: effects['newsModel/queryHotNews'],
    contractLoading: effects['contractModel/queryHotContracts'],
    hotLawyerList,
    hotNewsList,
    hotContractList,
  }),
)(Home);
