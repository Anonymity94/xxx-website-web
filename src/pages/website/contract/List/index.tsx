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
import type { ConnectState } from '@/models/connect';
import ajax from '@/utils/ajax';
import { DownloadOutlined, EyeOutlined, FireFilled } from '@ant-design/icons';
import ProList from '@ant-design/pro-list';
import { Card, Divider, Input, Space, Spin, Tag, Typography } from 'antd';
import { stringify } from 'querystring';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Dispatch } from 'umi';
import { connect, history, useLocation } from 'umi';
import fileIcon from '../assets/file.svg';
import { SPECIAL_CONTRACT_CATEGORY_ID, SPECIAL_CONTRACT_SUB_CATEGORY_ID } from '../Special';
import styles from './index.less';

const { CheckableTag } = Tag;

interface IContractCategoryProps {
  dispatch: Dispatch;
  loading?: boolean;
  contractModel: ConnectState['contractModel'];
}
const ContractList = ({ dispatch, loading, contractModel }: IContractCategoryProps) => {
  const [isReady, setIsReady] = useState(false);
  const [keyword, setKeyword] = useState<string | undefined>();
  const actionRef = useRef();

  const {
    categoryList = [],
    categoryMap = {},
    subCategoryList = [],
    subCategoryMap = {},
  } = contractModel;
  // @ts-ignore
  const {
    pathname,
    query,
  }: { pathname: string; query: { categoryId?: string; subcategoryId?: string } } = useLocation();

  const searchCategoryId = query.categoryId;
  const searchSubCategoryId = query.subcategoryId;

  const updateHistory = useCallback(
    (categoryId?: string, subcategoryId?: string) => {
      // @ts-ignore
      history.replace({
        pathname,
        query: {
          categoryId: categoryId || undefined,
          subcategoryId: subcategoryId || undefined,
        },
      });
    },
    [pathname],
  );

  const displaySubCategoryList = useMemo(() => {
    if (!searchCategoryId) {
      return subCategoryList;
    }
    const result = subCategoryList.filter((item) => item.categoryId === searchCategoryId);
    result.unshift({
      id: '',
      name: '不限',
      categoryId: searchCategoryId,
      categoryName: '',
      description: '',
      children: [],
    });
    return result;
  }, [searchCategoryId, subCategoryList]);

  useEffect(() => {
    updateHistory(searchCategoryId, searchSubCategoryId);
  }, [updateHistory, searchCategoryId, searchSubCategoryId]);

  useEffect(() => {
    dispatch({
      type: 'contractModel/queryCategoryAndSubCategory',
    });
  }, [dispatch]);

  useEffect(() => {
    // @ts-ignore
    actionRef?.current?.reloadAndRest();
  }, [actionRef?.current, searchCategoryId, searchSubCategoryId, keyword]);

  useEffect(() => {
    if (!isReady) {
      setIsReady(true);
    }
  }, [isReady]);

  return (
    <PageLayout>
      <Spin spinning={loading}>
        <Card
          className={styles.card}
          title={
            <div className={styles.titleBox}>
              <Space>
                <span className={styles.cardTitle}>合同范本</span>
                {searchCategoryId && (
                  <Tag
                    color="#263e56"
                    key="categoryId"
                    closable
                    onClose={() => updateHistory(undefined, undefined)}
                  >
                    {categoryMap[searchCategoryId]?.name || searchCategoryId}
                  </Tag>
                )}
                {searchSubCategoryId ? (
                  <Tag
                    color="#263e56"
                    key="subcategoryId"
                    closable
                    onClose={() => updateHistory(searchCategoryId, undefined)}
                  >
                    {subCategoryMap[searchSubCategoryId]?.name || searchSubCategoryId}
                  </Tag>
                ) : (
                  <Tag key="subCategoryId_empty" color="#263e56">
                    不限
                  </Tag>
                )}
              </Space>

              <Input.Search
                allowClear
                enterButton
                placeholder="输入合同名字搜索"
                className={styles.searchBox}
                onSearch={(value) => setKeyword(value)}
              />
            </div>
          }
        >
          {categoryList.map((item) => (
            <CheckableTag
              key={item.id}
              checked={searchCategoryId === item.id}
              onChange={(checked) => updateHistory(checked ? item.id : undefined, undefined)}
            >
              {item.name}
            </CheckableTag>
          ))}
          <Divider />
          {displaySubCategoryList.map((item) => (
            <CheckableTag
              key={item.id}
              checked={searchSubCategoryId === item.id || (!searchSubCategoryId && !item.id)}
              onChange={(checked) => updateHistory(item.categoryId, checked ? item.id : undefined)}
            >
              {item.name}
            </CheckableTag>
          ))}
        </Card>
      </Spin>

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
              categoryId: searchCategoryId,
              subcategoryId: searchSubCategoryId,
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

export default connect(({ loading, contractModel }: ConnectState) => ({
  loading: loading.models.contractModel,
  contractModel,
}))(ContractList);
