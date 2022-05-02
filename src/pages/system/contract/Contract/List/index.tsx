import type {
  IContract,
  IContractCategory,
  IContractSubCategory,
  IPageFactory,
  IRecommendResource,
  IAjaxResponseFactory,
} from '@/data-typings';
import { EBoolean, EStatus } from '@/data-typings';
import { proTableSerchConfig } from '@/dict';
import type { ConnectState } from '@/models/connect';
import ajax from '@/utils/ajax';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Popconfirm, Space } from 'antd';
import { stringify } from 'querystring';
import React, { useEffect, useMemo, useRef } from 'react';
import type { Dispatch } from 'umi';
import { connect, history, Link } from 'umi';

interface IContractListProps {
  dispatch: Dispatch;
  categoryList: IContractCategory[];
  subCategoryList: IContractSubCategory[];
  queryLoading?: boolean;
}
const ContractList = ({
  dispatch,
  categoryList = [],
  subCategoryList = [],
}: IContractListProps) => {
  const actionRef = useRef<ActionType>();

  useEffect(() => {
    dispatch({
      type: 'contractModel/queryContractCategories',
      payload: {},
    });
    dispatch({
      type: 'contractModel/queryContractSubCategories',
      payload: {},
    });
  }, [dispatch]);

  const categoryEnumValue = useMemo(() => {
    const result: Record<string, { text: string }> = {};
    categoryList.forEach((item) => {
      result[item.id] = { text: item.name };
    });
    return result;
  }, [categoryList]);

  const subcategoryEnumValue = useMemo(() => {
    const result: Record<string, { text: string }> = {};
    subCategoryList.forEach((item) => {
      result[item.id] = { text: item.name };
    });
    return result;
  }, [subCategoryList]);

  const handleDelete = (id: string) => {
    dispatch({
      type: 'contractModel/deleteContract',
      payload: { id },
    }).then(() => {
      actionRef.current?.reload();
    });
  };

  const columns: ProColumns<IContract>[] = [
    {
      title: '合同名称',
      dataIndex: 'name',
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: '所属大类',
      dataIndex: 'categoryId',
      ellipsis: true,
      render: (_, record) => record.categoryName,

      valueType: 'select',
      valueEnum: categoryEnumValue,
    },
    {
      title: '所属小类',
      dataIndex: 'subcategoryId',
      ellipsis: true,
      render: (_, record) => record.subcategoryName,

      valueType: 'select',
      valueEnum: subcategoryEnumValue,
    },
    {
      title: '热门合同',
      dataIndex: 'isHot',
      valueType: 'select',
      formItemProps: {
        rules: [],
      },
      valueEnum: {
        [EBoolean.True]: {
          text: '是',
        },
        [EBoolean.False]: {
          text: '否',
        },
      },
    },
    {
      title: '下载价格',
      dataIndex: 'price',
      valueType: 'money',
      search: false,
    },
    {
      title: '下载次数',
      dataIndex: 'downloadCount',
      valueType: 'digit',
      search: false,
    },
    {
      title: '点击次数',
      dataIndex: 'visitCount',
      valueType: 'digit',
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
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
      search: false,
      valueType: 'dateTime',
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 110,
      align: 'center',
      render: (_, record) => (
        <Space>
          <Link key="edit" to={`/system/contract/contract/${record.id}/update`}>
            编辑
          </Link>
          <Popconfirm key="delete" title="确定删除吗？" onConfirm={() => handleDelete(record.id)}>
            <a>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <ProTable<IContract>
      bordered
      size="small"
      columns={columns}
      request={async (params = {}) => {
        const { current, pageSize, ...rest } = params;
        const newParams = { size: pageSize, page: current! - 1, ...rest };
        const { success, result } = (await ajax(
          `/contract/contracts?${stringify(newParams)}`,
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
      rowKey="id"
      search={{
        ...proTableSerchConfig,
        optionRender: (searchConfig, formProps, dom) => [
          ...dom,
          <Button key="create" onClick={() => history.push('/system/contract/contract/create')}>
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
      scroll={{ x: 'max-content' }}
    />
  );
};

export default connect(
  ({ loading: { effects }, contractModel: { categoryList, subCategoryList } }: ConnectState) => ({
    categoryList,
    subCategoryList,
    queryLoading:
      effects['contractModel/queryContractCategories'] ||
      effects['contractModel/queryContractSubCategories'] ||
      effects['contractModel/queryContracts'],
  }),
)(ContractList);
