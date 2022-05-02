import type { SearchConfig } from '@ant-design/pro-table/lib/components/Form/FormRender';
import type { PaginationProps } from 'antd';

export const initPage: PaginationProps = {
  current: 0,
  total: 0,
  showTotal: (total: number) => `共 ${total} 条`,
  pageSize: 20,
  pageSizeOptions: ['10', '20', '30', '40', '50'],
  hideOnSinglePage: false,
  showSizeChanger: false,
  showQuickJumper: false,
};

export const proTableSerchConfig: SearchConfig = {
  labelWidth: 80,
  // 默认展开所有的搜索条件
  collapsed: false,
  // 不显示收起按钮
  collapseRender: false,
  span: 8,
};

