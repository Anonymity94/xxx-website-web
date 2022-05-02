import { exportExcel } from '@/components/ExportExcel';
import type {
  IAjaxResponseFactory,
  IFinancialContractOrderSummary,
  IRecommendResource,
} from '@/data-typings';
import { proTableSerchConfig } from '@/dict';
import ajax from '@/utils/ajax';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Pagination } from 'antd';
import { stringify } from 'querystring';
import React, { useRef, useState } from 'react';

const columns: ProColumns<IFinancialContractOrderSummary>[] = [
  {
    title: '合同',
    dataIndex: 'name',
    ellipsis: true,
    search: false,
  },
  {
    title: '查询时间',
    dataIndex: 'dateRange',
    hideInTable: true,
    valueType: 'dateRange',
  },
  {
    title: '总金额',
    dataIndex: 'total_payed',
    valueType: 'money',
    width: 200,
    search: false,
  },
  {
    title: '下载次数',
    dataIndex: 'download_count',
    valueType: 'digit',
    width: 200,
    search: false,
  },
  {
    title: '合同来源',
    dataIndex: 'source',
    search: false,
    ellipsis: true,
  },
];
const OrderList = () => {
  const actionRef = useRef<ActionType>();
  const [dataSource, setDataSource] = useState<IFinancialContractOrderSummary[]>([]);
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const handleExport = () => {
    // 标题栏
    const titleList = ['合同', '总金额', '下载次数', '合同来源'];
    if (dataSource.length === 0) {
      return;
    }

    const dataList: any[][] = [];
    dataSource.forEach((row) => {
      dataList.push([row.name, row.total_payed, row.download_count, row.source]);
    });

    exportExcel([titleList, ...dataList], '合同订单');
  };

  return (
    <>
      <ProTable<IFinancialContractOrderSummary>
        bordered
        size="small"
        columns={columns}
        request={async (params = {}) => {
          const { dateRange, ...rest } = params;
          const startTime = dateRange && dateRange[0] ? dateRange[0] : '';
          const endTime = dateRange && dateRange[1] ? dateRange[1] : '';
          const newParams = { startTime, endTime, ...rest };
          setPageNumber(1);
          setDataSource([]);

          const { success, result } = (await ajax(
            `/order/contracts?${stringify(newParams)}`,
          )) as IAjaxResponseFactory<IFinancialContractOrderSummary[]>;
          if (!success) {
            return {
              data: [],
              success,
            };
          }

          setDataSource(result);

          return {
            data: result,
            success,
          } as IRecommendResource<IFinancialContractOrderSummary[]>;
        }}
        rowKey="id"
        search={{
          ...proTableSerchConfig,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom,
            <Button key="export" onClick={() => handleExport()}>
              导出
            </Button>,
          ],
        }}
        form={{
          ignoreRules: false,
        }}
        actionRef={actionRef}
        dateFormatter="string"
        toolBarRender={false}
        pagination={false}
      />
      <div style={{ background: '#fff', padding: 10, display: 'flex', justifyContent: 'flex-end' }}>
        <Pagination
          size="small"
          current={pageNumber}
          pageSize={pageSize}
          total={dataSource.length}
          showSizeChanger
          onChange={(page, size) => {
            setPageNumber(page);
            setPageSize(size || 20);
          }}
          showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`}
        />
      </div>
    </>
  );
};

export default OrderList;
