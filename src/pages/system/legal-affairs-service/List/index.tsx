import { OPEN_API_PREFIX } from '@/appConfig';
import type {
  ILegalAffairsService,
  IRecommendResource,
  IAjaxResponseFactory,
} from '@/data-typings';
import { proTableSerchConfig } from '@/dict';
import ajax from '@/utils/ajax';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Popconfirm } from 'antd';
import { stringify } from 'querystring';
import React, { useRef } from 'react';
import type { Dispatch } from 'umi';
import { connect, history, Link } from 'umi';

const LegalAffairsList = ({ dispatch }: { dispatch: Dispatch }) => {
  const actionRef = useRef<ActionType>();
  const handleDelete = (id: string) => {
    dispatch({
      type: 'legalAffairsServiceModel/deleteLegalAffairsService',
      payload: { id },
    }).then(() => {
      actionRef.current?.reload();
    });
  };

  const columns: ProColumns<ILegalAffairsService>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      search: false,
      width: 80,
    },
    {
      title: '套餐名称',
      dataIndex: 'name',
      ellipsis: true,
      search: false,
    },
    {
      title: '订单编号前缀',
      dataIndex: 'prefix',
      search: false,
    },
    {
      title: '套餐价格',
      dataIndex: 'price',
      search: false,
      valueType: 'money',
    },
    {
      title: '创建时间',
      key: 'showTime',
      dataIndex: 'createTime',
      width: 200,
      search: false,
      valueType: 'dateTime',
    },
    {
      title: '操作',
      key: 'option',
      width: 120,
      valueType: 'option',
      render: (_, record) => [
        <Link key="edit" to={`/system/legal-affairs/service/${record.id}/update`}>
          编辑
        </Link>,
        <Popconfirm key="delete" title="确定删除吗？" onConfirm={() => handleDelete(record.id)}>
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <ProTable<ILegalAffairsService>
      bordered
      size="small"
      columns={columns}
      request={async (params = {}) => {
        const { current, pageSize, ...rest } = params;
        const newParams = { size: pageSize, page: current! - 1, ...rest };
        const { success, result } = (await ajax(
          `${OPEN_API_PREFIX}/legal-affairs/services?${stringify(newParams)}`,
        )) as IAjaxResponseFactory<ILegalAffairsService[]>;
        if (!success) {
          return {
            data: [],
            success,
          };
        }

        return {
          data: result,
          success,
        } as IRecommendResource<ILegalAffairsService[]>;
      }}
      rowKey="id"
      search={{
        ...proTableSerchConfig,
        optionRender: (searchConfig, formProps, dom) => [
          ...dom,
          <Button key="create" onClick={() => history.push('/system/legal-affairs/service/create')}>
            新建
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
  );
};

export default connect()(LegalAffairsList);
