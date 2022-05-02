import type { IContractCategory } from '@/data-typings';
import type { ConnectState } from '@/models/connect';
import { Button, Card, Popconfirm, Space, Table } from 'antd';
import type { ColumnProps } from 'antd/lib/table';
import React, { useCallback, useEffect } from 'react';
import type { Dispatch } from 'umi';
import { connect, history, Link } from 'umi';

interface IContractCategoryListProps {
  dispatch: Dispatch;
  categoryList: IContractCategory[];
}
const ContractCategoryList = ({ dispatch, categoryList }: IContractCategoryListProps) => {
  const queryData = useCallback(() => {
    dispatch({
      type: 'contractModel/queryContractCategories',
      payload: {},
    });
  }, [dispatch]);

  useEffect(() => {
    queryData();
  }, [queryData]);

  const handleDelete = (id: string) => {
    dispatch({
      type: 'contractModel/deleteContractCategory',
      payload: { id },
    }).then(() => {
      queryData();
    });
  };

  const columns: ColumnProps<IContractCategory>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '备注',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      key: 'option',
      width: 110,
      align: 'center',
      render: (_, record) => {
        return (
          <Space>
            <Link key="edit" to={`/system/contract/category/${record.id}/update`}>
              编辑
            </Link>
            <Popconfirm key="delete" title="确定删除吗？" onConfirm={() => handleDelete(record.id)}>
              <a>删除</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <Card bordered={false} size="small">
      <div style={{ textAlign: 'right', marginBottom: 10 }}>
        <Button
          key="create"
          type="primary"
          onClick={() => history.push('/system/contract/category/create')}
        >
          新建
        </Button>
      </div>
      <Table
        bordered
        size="small"
        columns={columns}
        dataSource={categoryList}
        scroll={{ scrollToFirstRowOnChange: true }}
      />
    </Card>
  );
};

export default connect(({ loading, contractModel: { categoryList } }: ConnectState) => ({
  categoryList,
  loading: loading.models.contractModel,
}))(ContractCategoryList);
