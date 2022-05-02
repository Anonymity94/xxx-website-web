/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 *
 * @see You can view component api by: https://github.com/ant-design/ant-design-pro-layout
 */
import { PRODUCT_LOGO, PRODUCT_NAME } from '@/appConfig';
import RightContent from '@/components/RightContent';
import WebsiteFooter from '@/components/WebsiteFooter';
import FixedWidget from '@/pages/website/ChatRoom/components/FixedWidget';
import LoginModal from '@/pages/website/LoginModal';
import type {
  BasicLayoutProps as ProLayoutProps,
  MenuDataItem,
  Settings,
} from '@ant-design/pro-layout';
import ProLayout from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import { history, Link, useIntl } from 'umi';
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
      pathname: '/web',
    },
  } = props;

  const { formatMessage } = useIntl();

  useEffect(() => {
    document.title = 'Title';
  }, [location.pathname]);

  return (
    <>
      <ProLayout
        className={styles.layout}
        logo={PRODUCT_LOGO}
        formatMessage={formatMessage}
        {...props}
        // onCollapse={handleMenuCollapse}
        onMenuHeaderClick={() => history.push('/')}
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
          {
            path: '/',
            breadcrumbName: formatMessage({ id: 'menu.home' }),
          },
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
        footerRender={() => <WebsiteFooter />}
        menuDataRender={menuDataRender}
        rightContentRender={() => <RightContent />}
        layout={'top'}
        navTheme={'light'}
        title={PRODUCT_NAME}
        disableContentMargin
        fixedHeader
      >
        {children}
      </ProLayout>
      <LoginModal />
      <FixedWidget />
    </>
  );
};

export default BasicLayout;
