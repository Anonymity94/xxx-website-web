import { Button, Result } from 'antd';
import React from 'react';
import { history, useLocation } from 'umi';

const NoFoundPage: React.FC = () => {
  const { pathname } = useLocation();

  const homePath = pathname.includes('/system/') ? '/system' : '/';

  return (
    <Result
      status="404"
      title="您访问的页面不存在！"
      subTitle="资源不存在或者没有访问权限"
      extra={
        <Button type="primary" onClick={() => history.push(homePath)}>
          返回首页
        </Button>
      }
    />
  );
};

export default NoFoundPage;
