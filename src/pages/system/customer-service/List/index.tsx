import type {
  ICustomerService,
  IPageFactory,
  IRecommendResource,
  IAjaxResponseFactory,
} from '@/data-typings';
import { EStatus } from '@/data-typings';
import { proTableSerchConfig } from '@/dict';
import ajax from '@/utils/ajax';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Popconfirm } from 'antd';
import { stringify } from 'querystring';
import React, { useRef } from 'react';
import type { Dispatch } from 'umi';
import { connect, history, Link } from 'umi';

const CustomerServiceList = ({ dispatch }: { dispatch: Dispatch }) => {
  const actionRef = useRef<ActionType>();
  const handleDelete = (id: string) => {
    dispatch({
      type: 'customerServiceModel/deleteCustomerService',
      payload: { id },
    }).then(() => {
      actionRef.current?.reload();
    });
  };

  const columns: ProColumns<ICustomerService>[] = [
    {
      title: '登录名称',
      dataIndex: 'loginName',
      ellipsis: true,
      search: false,
    },
    {
      title: '用户名称',
      dataIndex: 'fullName',
      ellipsis: true,
    },
    {
      title: '手机号码',
      dataIndex: 'telephone',
      search: false,
    },
    {
      title: '人员状态',
      dataIndex: 'status',
      valueType: 'select',
      width: 120,
      formItemProps: {
        rules: [],
      },
      valueEnum: {
        [EStatus.Open]: {
          text: '启用',
          status: 'Success',
        },
        [EStatus.Closed]: {
          text: '禁用',
          status: 'Default',
        },
      },
    },
    {
      title: '创建时间',
      key: 'showTime',
      dataIndex: 'createTime',
      width: 180,
      search: false,
      valueType: 'dateTime',
    },
    {
      title: '操作',
      key: 'option',
      width: 120,
      valueType: 'option',
      render: (_, record) => [
        <Link key="edit" to={`/system/user/customer-service/${record.id}/update`}>
          编辑
        </Link>,
        <Popconfirm key="delete" title="确定删除吗？" onConfirm={() => handleDelete(record.id)}>
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <ProTable<ICustomerService>
      bordered
      size="small"
      columns={columns}
      request={async (params = {}) => {
        const { current, pageSize, ...rest } = params;
        const newParams = { size: pageSize, page: current! - 1, ...rest };
        const { success, result } = (await ajax(
          `/user/customer-services?${stringify(newParams)}`,
        )) as IAjaxResponseFactory<IPageFactory<ICustomerService>>;
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
        } as IRecommendResource<ICustomerService[]>;
      }}
      rowKey="id"
      search={{
        ...proTableSerchConfig,
        optionRender: (searchConfig, formProps, dom) => [
          ...dom,
          <Button key="create" onClick={() => history.push('/system/user/customer-service/create')}>
            新建
          </Button>,
        ],
      }}
      form={{
        ignoreRules: false,
      }}
      actionRef={actionRef}
      dateFormatter="string"
      toolBarRender={false}
    />
  );
};

export default connect()(CustomerServiceList);
