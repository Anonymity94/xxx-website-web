import type { IContractSubCategory } from '@/data-typings';
import type { ConnectState } from '@/models/connect';
import { Button, Card, Popconfirm, Space, Table } from 'antd';
import type { ColumnProps } from 'antd/lib/table';
import React, { useCallback, useEffect } from 'react';
import type { Dispatch } from 'umi';
import { connect, history, Link } from 'umi';

interface IContractSubCategoryListProps {
  dispatch: Dispatch;
  subCategoryList: IContractSubCategory[];
}
const ContractSubCategoryList = ({ dispatch, subCategoryList }: IContractSubCategoryListProps) => {
  const queryData = useCallback(() => {
    dispatch({
      type: 'contractModel/queryContractSubCategories',
      payload: {},
    });
  }, [dispatch]);

  useEffect(() => {
    queryData();
  }, [queryData]);

  const handleDelete = (id: string) => {
    dispatch({
      type: 'contractModel/deleteContractSubCategory',
      payload: { id },
    }).then(() => {
      queryData();
    });
  };

  const columns: ColumnProps<IContractSubCategory>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '所属大类',
      dataIndex: 'categoryName',
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
      render: (_, record) => (
        <Space>
          <Link key="edit" to={`/system/contract/sub-category/${record.id}/update`}>
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
    <Card bordered={false} size="small">
      <div style={{ textAlign: 'right', marginBottom: 10 }}>
        <Button
          key="create"
          type="primary"
          onClick={() => history.push('/system/contract/sub-category/create')}
        >
          新建
        </Button>
      </div>
      <Table
        bordered
        size="small"
        columns={columns}
        dataSource={subCategoryList}
        scroll={{ scrollToFirstRowOnChange: true }}
      />
    </Card>
  );
};

export default connect(({ loading, contractModel: { subCategoryList } }: ConnectState) => ({
  subCategoryList,
  loading: loading.models.contractModel,
}))(ContractSubCategoryList);
