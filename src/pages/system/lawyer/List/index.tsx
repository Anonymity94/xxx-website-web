import type {
  ILawyer,
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

const LawyerList = ({ dispatch }: { dispatch: Dispatch }) => {
  const actionRef = useRef<ActionType>();
  const handleDelete = (id: string) => {
    dispatch({
      type: 'lawyerModel/deleteLawyer',
      payload: { id },
    }).then(() => {
      actionRef.current?.reload();
    });
  };

  const columns: ProColumns<ILawyer>[] = [
    {
      title: '排序序号',
      dataIndex: 'sortNumber',
      ellipsis: true,
      search: false,
      width: 80,
    },
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
      title: '省份',
      dataIndex: 'province',
      ellipsis: true,
    },
    {
      title: '城市',
      dataIndex: 'city',
      ellipsis: true,
    },
    {
      title: '公司名称',
      dataIndex: 'company',
      ellipsis: true,
    },
    // {
    //   title: '人员状态',
    //   dataIndex: 'status',
    //   valueType: 'select',
    //   width: 120,
    //   formItemProps: {
    //     rules: [],
    //   },
    //   valueEnum: {
    //     [EStatus.Open]: {
    //       text: '启用',
    //       status: 'Success',
    //     },
    //     [EStatus.Closed]: {
    //       text: '禁用',
    //       status: 'Default',
    //     },
    //   },
    // },
    {
      title: '接单状态',
      dataIndex: 'orderStatus',
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
      title: '接单价格',
      dataIndex: 'orderPrice',
      width: 120,
      valueType: 'money',
    },
    // {
    //   title: '创建时间',
    //   key: 'showTime',
    //   dataIndex: 'createTime',
    //   width: 180,
    //   search: false,
    //   valueType: 'dateTime',
    // },
    {
      title: '操作',
      key: 'option',
      width: 120,
      valueType: 'option',
      render: (_, record) => [
        <Link key="edit" to={`/system/user/lawyer/${record.id}/update`}>
          编辑
        </Link>,
        <Popconfirm key="delete" title="确定删除吗？" onConfirm={() => handleDelete(record.id)}>
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <ProTable<ILawyer>
      bordered
      size="small"
      columns={columns}
      request={async (params = {}) => {
        const { current, pageSize, ...rest } = params;
        const newParams = { size: pageSize, page: current! - 1, ...rest };
        const { success, result } = (await ajax(
          `/user/lawyers?${stringify(newParams)}`,
        )) as IAjaxResponseFactory<IPageFactory<ILawyer>>;
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
        } as IRecommendResource<ILawyer[]>;
      }}
      rowKey="id"
      search={{
        ...proTableSerchConfig,
        optionRender: (searchConfig, formProps, dom) => [
          ...dom,
          <Button key="create" onClick={() => history.push('/system/user/lawyer/create')}>
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

export default connect()(LawyerList);
