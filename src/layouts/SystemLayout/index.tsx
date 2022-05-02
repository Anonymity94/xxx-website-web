/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 *
 * @see You can view component api by: https://github.com/ant-design/ant-design-pro-layout
 */
import { PRODUCT_LOGO } from '@/appConfig';
import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import NoAuthPage from '@/pages/403';
import type {
  BasicLayoutProps as ProLayoutProps,
  MenuDataItem,
  Settings
} from '@ant-design/pro-layout';
import ProLayout, { PageContainer } from '@ant-design/pro-layout';
import React from 'react';
import { history, Link, useAccess, useIntl } from 'umi';
import styles from './index.less';

export type BasicLayoutProps = {
  breadcrumbNameMap: Record<string, MenuDataItem>;
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
} & ProLayoutProps;

export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: Record<string, MenuDataItem>;
};

const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
  menuList.map((item) => {
    return {
      ...item,
      children: item.children ? menuDataRender(item.children) : undefined,
    };
  });

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const {
    children,
    location = {
      pathname: '/system',
    },
  } = props;

  const access = useAccess();

  const { formatMessage } = useIntl();

  if (!access.isLogin || !access.isAdmin) {
    return <NoAuthPage />;
  }

  return (
    <ProLayout
      className={styles['system-layout']}
      logo={PRODUCT_LOGO}
      formatMessage={formatMessage}
      {...props}
      // onCollapse={handleMenuCollapse}
      onMenuHeaderClick={() => history.push('/system')}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (
          menuItemProps.isUrl ||
          !menuItemProps.path ||
          location.pathname === menuItemProps.path
        ) {
          return defaultDom;
        }
        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => [
        // {
        //   path: '/',
        //   breadcrumbName: formatMessage({ id: 'menu.home' }),
        // },
        ...routers,
      ]}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}
      footerRender={() => <Footer />}
      menuDataRender={menuDataRender}
      rightContentRender={() => <RightContent />}
      layout="side"
      fixSiderbar
      navTheme="dark"
      title="后台管理"
    >
      <PageContainer title={false}>{children}</PageContainer>
    </ProLayout>
  );
};

export default BasicLayout;
