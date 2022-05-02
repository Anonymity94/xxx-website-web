import { outLogin } from '@/services';
import { isSystemPage } from '@/utils/utils';
import {
  CustomerServiceOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Menu, Spin } from 'antd';
import React, { useCallback } from 'react';
import { history, useAccess, useModel } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
  await outLogin();
  // 如果是管理员页面，直接返回登录
  if (isSystemPage()) {
    history.replace({
      pathname: '/system/login',
    });
  }
  // 其他的页面回到首页
  history.push('/web');
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const access = useAccess();

  const onMenuClick = useCallback(
    (event: {
      key: React.Key;
      keyPath: React.Key[];
      item: React.ReactInstance;
      domEvent: React.MouseEvent<HTMLElement>;
    }) => {
      const { key } = event;
      if (key === 'logout' && initialState) {
        setInitialState({ ...initialState, currentUser: undefined });
        loginOut();
      }
      if (key === 'settings') {
        history.push('/web/account/settings');
      }
      if (key === 'chat') {
        window.open('/web/chat');
      }
      if (key === 'system') {
        window.open('/system');
      }
    },
    [initialState, setInitialState],
  );

  const openLoginModal = useCallback(() => {
    setInitialState({ ...initialState, loginModalVisible: true });
  }, [initialState, setInitialState]);

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    if (isSystemPage()) {
      return loading;
    }
    return null;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.full_name) {
    if (isSystemPage()) {
      return loading;
    }
    return (
      <Button type="primary" size="small" onClick={openLoginModal}>
        会员登录
      </Button>
    );
  }

  const menuHeaderDropdown = (
    // @ts-ignore
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {currentUser && currentUser.id && access.isLawyer && (
        <>
          <Menu.Item key="settings">
            <UserOutlined />
            个人设置
          </Menu.Item>
          <Menu.Divider />
        </>
      )}
      {/* 律师、客服、法务可以有咨询工作台 */}
      {currentUser &&
        currentUser.id &&
        (access.isLawyer || access.isCustomerService || access.isLegalAffairs) && (
          <>
            <Menu.Item key="chat">
              <CustomerServiceOutlined />
              咨询工作台
            </Menu.Item>
            <Menu.Divider />
          </>
        )}
      {currentUser && currentUser.id && access.isAdmin && (
        <>
          <Menu.Item key="system">
            <SettingOutlined />
            后台管理
          </Menu.Item>
          <Menu.Divider />
        </>
      )}

      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar
          className={styles.avatar}
          size="small"
          style={{ backgroundColor: '#87d068' }}
          icon={<UserOutlined />}
        />
        <span className={`${styles.name} anticon`}>{currentUser.full_name}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
