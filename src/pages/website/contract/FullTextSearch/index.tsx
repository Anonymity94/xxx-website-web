import type { IContractFullTextSearchResult } from '@/data-typings';
import { EBoolean, EStatus } from '@/data-typings';
import PageLayout from '@/layouts/PageLayout';
import NoAuthPage from '@/pages/403';
import { queryContracts, searchContract } from '@/services';
import { Alert, Input, List, message, Tag } from 'antd';
import { useState } from 'react';
import { history, useAccess } from 'umi';
import { parseObject } from '../../AI-ce';

const ContractFullTextSearch = () => {
  const access = useAccess();
  const [queryLoading, setQueryLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<IContractFullTextSearchResult['data']>(
    [] as any,
  );

  const handleSearch = (value?: string) => {
    if (queryLoading) {
      return;
    }
    if (!value) {
      setSearchResult([] as any);
      return;
    }
    setQueryLoading(true);
    searchContract(value)
      .then((response: string) => {
        setQueryLoading(false);
        const result = parseObject(response) as IContractFullTextSearchResult;
        console.log(result);

        if (result.code !== '200') {
          setSearchResult([] as IContractFullTextSearchResult['data']);
          message.warning('检索出现异常');
          return;
        }
        setSearchResult(result.data);
      })
      .finally(() => {
        setQueryLoading(false);
      });
  };

  // 点击跳转到合同详情
  const handleJumpDetail = (name: string) => {
    const key = 'query_detail_loading';
    message.loading({ content: 'Loading...', duration: 0, key });
    queryContracts({
      name: name.split('.')[0] || '',
      page: 0,
      size: 10,
      jq: EBoolean.False,
      status: EStatus.Open,
    }).then(({ success, result }) => {
      message.destroy(key);

      if (!success || !Array.isArray(result?.content) || result?.content.length === 0) {
        message.info('未找到相关合同');
        return;
      }
      // 取合同的第一个进行跳转
      const contractId = result.content[0].id;
      history.push(`/web/contract/${contractId}`);
    });
  };

  const formatNumber = (num: number) => {
    const b = num.toFixed(2);
    return parseFloat(b);
  };

  if (!access.isLegalAffairs) {
    return <NoAuthPage />;
  }

  return (
    <PageLayout>
      <Alert
        showIcon
        message="输入合同内容关键字进行全文检索"
        type="info"
        style={{ marginBottom: 20 }}
      />
      <Input.Search
        size="large"
        allowClear
        enterButton="合同全文检索"
        placeholder="输入内容关键字进行全文检索"
        onSearch={(value) => handleSearch(value)}
        loading={queryLoading}
        style={{ marginBottom: 20 }}
      />

      {/* 搜索结果 */}
      <List<[string, number]>
        style={{ minHeight: 400 }}
        header={<div>检索结果</div>}
        bordered
        dataSource={searchResult}
        loading={queryLoading}
        renderItem={(item) => (
          <List.Item
            actions={[
              <a key="detail" onClick={() => handleJumpDetail(item[0])}>
                详情
              </a>,
            ]}
          >
            <Tag color="#2db7f5">{formatNumber(item[1])}</Tag> {item[0]}
          </List.Item>
        )}
      />
    </PageLayout>
  );
};

export default ContractFullTextSearch;
