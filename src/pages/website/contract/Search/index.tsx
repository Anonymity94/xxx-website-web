import { OPEN_API_PREFIX } from '@/appConfig';
import IconText from '@/components/IconText';
import type {
  IContract,
  IPageFactory,
  IRecommendResource,
  IAjaxResponseFactory,
} from '@/data-typings';
import { EStatus } from '@/data-typings';
import PageLayout from '@/layouts/PageLayout';
import ajax from '@/utils/ajax';
import { DownloadOutlined, EyeOutlined, FireFilled } from '@ant-design/icons';
import ProList from '@ant-design/pro-list';
import { Card, Input, Space, Typography } from 'antd';
import { stringify } from 'querystring';
import React, { useEffect, useRef, useState } from 'react';
import { history } from 'umi';
import fileIcon from '../assets/file.svg';
import styles from '../List/index.less';
import { SPECIAL_CONTRACT_CATEGORY_ID, SPECIAL_CONTRACT_SUB_CATEGORY_ID } from '../Special';

const ContractSearch = () => {
  const [keyword, setKeyword] = useState<string | undefined>();
  const actionRef = useRef();

  useEffect(() => {
    // @ts-ignore
    actionRef?.current?.reloadAndRest();
  }, [actionRef, keyword]);

  return (
    <PageLayout>
      <Input.Search
        size="large"
        allowClear
        enterButton="合同搜索"
        placeholder="输入合同名字搜索"
        onSearch={(value) => setKeyword(value)}
      />

      <Card bordered className={styles['list-wrap']}>
        <ProList<IContract>
          actionRef={actionRef}
          className={styles.list}
          itemLayout="vertical"
          rowKey="id"
          split
          request={async (params = {}) => {
            const { current, pageSize, ...rest } = params;
            const newParams = {
              size: pageSize,
              page: current! - 1,
              ...rest,
              status: EStatus.Open,
              name: keyword,
              excludeCategoryId: SPECIAL_CONTRACT_CATEGORY_ID,
              excludeSubcategoryId: SPECIAL_CONTRACT_SUB_CATEGORY_ID,
            };
            const { success, result } = (await ajax(
              `${OPEN_API_PREFIX}/contract/contracts?${stringify(newParams)}`,
            )) as IAjaxResponseFactory<IPageFactory<IContract>>;
            if (!success) {
              return {
                data: [],
                success,
              };
            }

            return {
              data: result.content,
              success,
              page: result.number,
              total: result.totalElements,
            } as IRecommendResource<IContract[]>;
          }}
          pagination={{
            pageSize: 20,
          }}
          metas={{
            title: {
              render: (_, row) => {
                return (
                  <span onClick={() => history.push(`/web/contract/${row.id}`)}>
                    {row.name} {row.isHot ? <FireFilled style={{ color: '#ff5722' }} /> : ''}
                  </span>
                );
              },
            },
            avatar: {
              render: () => {
                return <img className={styles.avatar} src={fileIcon} />;
              },
            },
            description: {
              render: (_, row) => {
                return (
                  <>
                    <div className={styles.description}>
                      <Typography.Paragraph ellipsis={{ rows: 2 }}>
                        {row.profile}
                      </Typography.Paragraph>
                    </div>
                    <Space>
                      <IconText icon={EyeOutlined} text={`${row.visitCount || 0}`} key="eye-o" />
                      <IconText
                        icon={DownloadOutlined}
                        text={`${row.downloadCount}`}
                        key="download-o"
                      />
                    </Space>
                  </>
                );
              },
            },
          }}
        />
      </Card>
    </PageLayout>
  );
};

export default ContractSearch;
