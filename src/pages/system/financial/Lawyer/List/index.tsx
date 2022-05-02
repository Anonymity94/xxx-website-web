import { exportExcel } from '@/components/ExportExcel';
import type {
  IAjaxResponseFactory,
  IFinancialLawyerOrderSummary,
  IRecommendResource,
} from '@/data-typings';
import { proTableSerchConfig } from '@/dict';
import ajax from '@/utils/ajax';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Pagination } from 'antd';
import { stringify } from 'querystring';
import React, { useRef, useState } from 'react';
import { Link } from 'umi';

const columns: ProColumns<IFinancialLawyerOrderSummary>[] = [
  {
    title: '律师',
    dataIndex: 'name',
    width: 120,
    render: (_, record) => {
      return record.full_name;
    },
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
    width: 120,
    valueType: 'money',
    search: false,
  },
  {
    title: '操作',
    key: 'option',
    width: 120,
    valueType: 'option',
    render: (_, record) => [
      <Link key="edit" to={`/system/financial/lawyer/detail?id=${record.id}`}>
        律师订单详情
      </Link>,
    ],
  },
];

const OrderList = () => {
  const actionRef = useRef<ActionType>();

  const [dataSource, setDataSource] = useState<IFinancialLawyerOrderSummary[]>([]);
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const handleExport = () => {
    // 标题栏
    const titleList = ['律师', '总金额'];
    if (dataSource.length === 0) {
      return;
    }

    const dataList: [any, any][] = [];
    dataSource.forEach((row) => {
      dataList.push([row.full_name, row.total_payed]);
    });

    exportExcel([titleList, ...dataList], '律师订单');
  };

  return (
    <>
      <ProTable<IFinancialLawyerOrderSummary>
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
            `/order/lawyers?${stringify(newParams)}`,
          )) as IAjaxResponseFactory<IFinancialLawyerOrderSummary[]>;
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
            // page: result.number,
            total: result.length,
          } as IRecommendResource<IFinancialLawyerOrderSummary[]>;
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
        pagination={false}
        form={{
          ignoreRules: false,
        }}
        actionRef={actionRef}
        dateFormatter="string"
        toolBarRender={false}
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
