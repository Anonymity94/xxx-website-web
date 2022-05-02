import { Button, Result } from 'antd';
import React from 'react';
import { history, useLocation } from 'umi';

const NoAuthPage: React.FC = () => {
  const { pathname } = useLocation();

  const homePath = pathname.includes('/system/') ? '/system' : '/';

  return (
    <Result
      status="403"
      title="您没有权限访问当前页面"
      subTitle="资源不存在或者没有访问权限"
      extra={
        <Button type="primary" onClick={() => history.push(homePath)}>
          返回首页
        </Button>
      }
    />
  );
};

export default NoAuthPage;
