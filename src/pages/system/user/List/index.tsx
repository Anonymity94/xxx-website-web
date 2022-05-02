import type { IPageFactory, IRecommendResource, IAjaxResponseFactory, IUser } from '@/data-typings';
import { proTableSerchConfig } from '@/dict';
import ajax from '@/utils/ajax';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { stringify } from 'querystring';
import React from 'react';

const columns: ProColumns<IUser>[] = [
  {
    title: '手机号码',
    dataIndex: 'telephone',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    search: false,
    valueType: 'dateTime',
  },
];

const UserList = () => {
  return (
    <ProTable<IUser>
      bordered
      size="small"
      columns={columns}
      request={async (params = {}) => {
        const { current, pageSize, ...rest } = params;
        const newParams = { size: pageSize, page: current! - 1, ...rest };
        const { success, result } = (await ajax(
          `/user/users?${stringify(newParams)}`,
        )) as IAjaxResponseFactory<IPageFactory<IUser>>;
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
        } as IRecommendResource<IUser[]>;
      }}
      rowKey="id"
      search={{
        ...proTableSerchConfig,
      }}
      form={{
        ignoreRules: false,
      }}
      dateFormatter="string"
      toolBarRender={false}
    />
  );
};

export default UserList;
