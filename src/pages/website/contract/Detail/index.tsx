import { PRODUCT_NAME, UPLOAD_FILE_PATH_PREFIX } from '@/appConfig';
import IconText from '@/components/IconText';
import type { IContract } from '@/data-typings';
import PageLayout from '@/layouts/PageLayout';
import type { ConnectState } from '@/models/connect';
import {
  DownloadOutlined,
  EyeOutlined,
  FireFilled,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { WaterMark } from '@ant-design/pro-layout';
import ProList from '@ant-design/pro-list';
import { Button, Card, Image, message, Result, Skeleton, Space, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import type { Dispatch } from 'umi';
import { connect, useParams } from 'umi';
import fileIcon from '../assets/file-detail.svg';
import type { IPayModalRefProps } from '../../PayModal';
import PayModal from '../../PayModal';

interface IContractDetailProps {
  dispatch: Dispatch;
  queryLoading: boolean;
  detail: IContract;
}
const LawyerDtail = ({
  dispatch,
  queryLoading,
  detail = {} as IContract,
}: IContractDetailProps) => {
  const [isReady, setIsReady] = useState(false);
  const payModalRef = useRef<IPayModalRefProps>();

  const { id }: { id: string } = useParams();

  useEffect(() => {
    dispatch({
      type: 'contractModel/queryContractDetail',
      payload: { id },
    });

    return () => {
      dispatch({
        type: 'contractModel/updateState',
        payload: { detail: {} },
      });
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (!isReady) {
      setIsReady(true);
    }
  }, [isReady]);

  const handleDownload = () => {
    if (!detail.id) {
      message.error('找不到相关合同');
    }

    payModalRef?.current?.handleDownload(detail);
  };

  const renderContent = () => {
    if (!isReady || queryLoading) {
      return <Skeleton active />;
    }

    if (!detail.id) {
      return <Result status="info" title="资源不存在或已被删除" />;
    }

    const previewImgList = detail.filePreviewImg?.split(',') || [];

    return (
      <>
        <Card bordered bodyStyle={{ paddingTop: 10, paddingBottom: 0 }}>
          <ProList<IContract>
            itemLayout="vertical"
            rowKey="id"
            split
            toolBarRender={false}
            dataSource={[{ ...detail }]}
            metas={{
              title: {
                render: (_, row) => {
                  return (
                    <>
                      {row.name} {row.isHot ? <FireFilled style={{ color: '#ff5722' }} /> : ''}
                    </>
                  );
                },
              },
              subTitle: {
                render: (_, row) => {
                  return (
                    <Space style={{ fontSize: 14 }}>
                      <IconText
                        icon={EyeOutlined}
                        text={`${row.visitCount || 0} 次阅读`}
                        key="eye-o"
                      />
                      <IconText
                        icon={DownloadOutlined}
                        text={`${row.downloadCount || 0} 次下载`}
                        key="download-o"
                      />
                    </Space>
                  );
                },
              },
              extra: {
                render: () => <img height={168} alt="logo" src={fileIcon} />,
              },
              description: {
                render: (_, row) => {
                  return (
                    <>
                      <div style={{ height: 60 }}>
                        <Typography.Paragraph ellipsis={{ rows: 2 }}>
                          {row.profile}
                        </Typography.Paragraph>
                      </div>
                      <span>来源：{row.source}</span>
                    </>
                  );
                },
              },
            }}
          />
        </Card>
        <Card style={{ marginTop: 20 }}>
          <div
            style={{ marginBottom: 20, maxHeight: 842 * 2, overflowY: 'auto', textAlign: 'center' }}
          >
            {/* 合同截图 */}
            {previewImgList.length > 0 ? (
              <WaterMark
                rotate={-22}
                content={PRODUCT_NAME}
                fontColor="rgba(0,0,0,.15)"
                fontSize={20}
                gapX={100}
                zIndex={9}
              >
                <Image.PreviewGroup>
                  {previewImgList.map((img) => (
                    <Image key={img} src={`${UPLOAD_FILE_PATH_PREFIX}${img}`} />
                  ))}
                </Image.PreviewGroup>
              </WaterMark>
            ) : (
              <Result icon={<QuestionCircleOutlined />} title="未找到合同的相关资料" />
            )}
          </div>

          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownload}
            style={{
              display: 'block',
              margin: '0 auto',
            }}
          >
            下载全文
          </Button>
        </Card>
      </>
    );
  };

  return (
    <>
      <PageLayout>{renderContent()}</PageLayout>
      <PayModal ref={payModalRef} />
    </>
  );
};

export default connect(
  ({ loading: { effects }, contractModel: { contractDetail } }: ConnectState) => ({
    queryLoading: effects['contractModel/queryContractDetail'] || false,
    detail: contractDetail,
  }),
)(LawyerDtail);
