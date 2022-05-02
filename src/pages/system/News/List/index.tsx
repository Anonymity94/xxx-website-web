import type { INews, IPageFactory, IRecommendResource, IAjaxResponseFactory } from '@/data-typings';
import { EBoolean, EStatus } from '@/data-typings';
import { proTableSerchConfig } from '@/dict';
import ajax from '@/utils/ajax';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Popconfirm } from 'antd';
import { stringify } from 'querystring';
import React, { useRef } from 'react';
import type { Dispatch } from 'umi';
import { connect, history, Link } from 'umi';

const NewsList = ({ dispatch }: { dispatch: Dispatch }) => {
  const actionRef = useRef<ActionType>();
  const handleDelete = (id: string) => {
    dispatch({
      type: 'newsModel/deleteNews',
      payload: { id },
    }).then(() => {
      actionRef.current?.reload();
    });
  };

  const columns: ProColumns<INews>[] = [
    {
      title: '标题',
      dataIndex: 'title',
      ellipsis: true,
      search: false,
    },
    {
      title: '简介',
      dataIndex: 'profile',
      ellipsis: true,
      search: false,
    },
    {
      title: '是否置顶',
      dataIndex: 'isTop',
      width: 120,
      search: false,
      valueEnum: {
        [EBoolean.True]: {
          text: '是',
          status: EBoolean.True,
        },
        [EBoolean.False]: {
          text: '否',
          status: EBoolean.False,
        },
      },
    },
    {
      title: '状态',
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
      title: '点击数',
      dataIndex: 'visitCount',
      search: false,
      width: 120,
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
        <Link key="edit" to={`/system/news/${record.id}/update`}>
          编辑
        </Link>,
        <Popconfirm key="delete" title="确定删除吗？" onConfirm={() => handleDelete(record.id)}>
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <ProTable<INews>
      bordered
      size="small"
      columns={columns}
      request={async (params = {}) => {
        const { current, pageSize, ...rest } = params;
        const newParams = { size: pageSize, page: current! - 1, ...rest };
        const { success, result } = (await ajax(
          `/news?${stringify(newParams)}`,
        )) as IAjaxResponseFactory<IPageFactory<INews>>;
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
        } as IRecommendResource<INews[]>;
      }}
      rowKey="id"
      search={{
        ...proTableSerchConfig,
        optionRender: (searchConfig, formProps, dom) => [
          ...dom,
          <Button key="create" onClick={() => history.push('/system/news/create')}>
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

export default connect()(NewsList);
