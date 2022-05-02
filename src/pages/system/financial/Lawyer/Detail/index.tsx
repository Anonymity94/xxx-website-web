import { exportExcel } from '@/components/ExportExcel';
import type {
  IAjaxResponseFactory,
  IFinancialLawyerOrderDetail,
  IRecommendResource,
} from '@/data-typings';
import { proTableSerchConfig } from '@/dict';
import ajax from '@/utils/ajax';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Pagination } from 'antd';
import { stringify } from 'querystring';
import React, { useRef, useState } from 'react';
import { useLocation } from 'umi';

const columns: ProColumns<IFinancialLawyerOrderDetail>[] = [
  {
    title: '查询时间',
    dataIndex: 'dateRange',
    hideInTable: true,
    valueType: 'dateRange',
  },
  {
    title: '律师',
    dataIndex: 'full_name',
    search: false,
  },
  {
    title: '支付金额',
    dataIndex: 'payed',
    valueType: 'money',
    search: false,
  },
  {
    title: '支付渠道',
    dataIndex: 'pay_type',
    search: false,
  },
  {
    title: '开始时间',
    dataIndex: 'create_time',
    width: 180,
    search: false,
  },
  {
    title: '结束时间',
    dataIndex: 'end_time',
    width: 180,
    search: false,
  },
  {
    title: '评价',
    dataIndex: 'evaluate',
    width: 180,
    search: false,
    ellipsis: true,
  },
];

const OrderList = () => {
  const location = useLocation();
  const actionRef = useRef<ActionType>();

  const [dataSource, setDataSource] = useState<IFinancialLawyerOrderDetail[]>([]);
  const [pageSize, setPageSize] = useState<number>(20);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const handleExport = () => {
    // 标题栏
    const titleList = ['律师', '支付金额', '支付渠道', '开始时间', '结束时间', '评分', '评价'];
    if (dataSource.length === 0) {
      return;
    }

    const dataList: any[][] = [];
    dataSource.forEach((row) => {
      dataList.push([
        row.full_name,
        row.payed,
        row.pay_type,
        row.create_time,
        row.end_time,
        row.score,
        row.evaluate,
      ]);
    });

    exportExcel([titleList, ...dataList], '律师订单');
  };

  return (
    <>
      <ProTable<IFinancialLawyerOrderDetail>
        bordered
        size="small"
        columns={columns}
        request={async (params = {}) => {
          const { dateRange, ...rest } = params;
          const startTime = dateRange && dateRange[0] ? dateRange[0] : '';
          const endTime = dateRange && dateRange[1] ? dateRange[1] : '';
          const newParams = {
            startTime,
            endTime,
            ...rest,
            // @ts-ignore
            id: location.query.id,
          };
          setPageNumber(1);
          setDataSource([]);
          const { success, result } = (await ajax(
            `/order/lawyer-detail?${stringify(newParams)}`,
          )) as IAjaxResponseFactory<IFinancialLawyerOrderDetail[]>;
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
          } as IRecommendResource<IFinancialLawyerOrderDetail[]>;
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
        pagination={false}
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
