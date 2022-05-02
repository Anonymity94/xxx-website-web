import { isDev } from '@/appConfig';
import type { ICurrentUser, IAjaxResponseFactory } from '@/data-typings';
import { EBoolean } from '@/data-typings';
import { EUserRole } from '@/data-typings';
import type { ConnectState } from '@/models/connect';
import { queryPhoneCaptcha, queryPhoneCaptchaByUsername } from '@/services/login';
import { LockOutlined, MailOutlined, MobileOutlined, UserOutlined } from '@ant-design/icons';
import { ModalForm, ProFormCaptcha, ProFormText } from '@ant-design/pro-form';
import { message, notification, Tabs } from 'antd';
import { useCallback, useState } from 'react';
import type { Dispatch } from 'umi';
import { connect, useModel } from 'umi';
import styles from './index.less';

const phoneReg = /^1\d{10}$/;

enum ELoginType {
  'Password' = 'password',
  'Phone' = 'phone',
}

export type ILoginModalProps = {
  dispatch: Dispatch;
  submitting?: boolean;
};

const LoginModal = ({ submitting, dispatch }: ILoginModalProps) => {
  const { initialState, setInitialState, refresh } = useModel('@@initialState');
  const [loginType, setLoginType] = useState<ELoginType>(ELoginType.Phone);

  /** 关闭登录框 */
  const closeLoginModal = useCallback(() => {
    setInitialState({ ...initialState, loginModalVisible: false });
  }, [initialState, setInitialState]);

  /** 获取用户登录信息 */
  const fetchUserInfo = async () => {
    const userInfo: ICurrentUser | undefined = await initialState?.fetchUserInfo?.();

    if (userInfo) {
      setInitialState({
        ...initialState,
        currentUser: userInfo,
      });

      // 打开工作台
      if (
        [EUserRole.CUSTOMER_SERVICE, EUserRole.LAWYER, EUserRole.LEGAL_AFFAIRS].includes(
          userInfo.role,
        )
      ) {
        // 打开工作台
        notification.info({
          message: '登录成功',
          description: '您可以点击页面右上角个人名称，进入【咨询工作台】，接收对话咨询',
          duration: 0,
        });
      }
    }
  };

  const handleSubmit = async (values: any) => {
    const isphone = loginType === ELoginType.Phone;
    const payload = {
      username: isphone ? values.mobile : values.username,
      password: isphone ? values.code : values.password,
      isphone: isphone ? EBoolean.True : EBoolean.False,
      vcode: isphone ? '' : values.vcode,
    };

    if (!payload.vcode) {
      // @ts-ignore
      delete payload.vcode;
    }

    dispatch({
      type: 'loginModel/login',
      payload,
    }).then(async (response: IAjaxResponseFactory<any>) => {
      const { success } = response;
      if (success) {
        message.success('登录成功');
        await fetchUserInfo();
        closeLoginModal();
        refresh();
      } else {
        message.error('登录失败');
      }
    });
  };

  const handleLoginTypeChange = (type: any) => {
    setLoginType(type);
  };

  return (
    <>
      <ModalForm
        title="用户登录"
        visible={initialState?.loginModalVisible}
        onFinish={handleSubmit}
        modalProps={{
          width: 400,
          destroyOnClose: true,
          maskClosable: false,
          onCancel: closeLoginModal,
          bodyStyle: { paddingTop: 10 },
        }}
        submitter={{
          submitButtonProps: {
            loading: submitting,
          },
        }}
      >
        <Tabs activeKey={loginType as any} onChange={handleLoginTypeChange}>
          <Tabs.TabPane key={ELoginType.Phone} tab="手机号登录" />
          <Tabs.TabPane key={ELoginType.Password} tab="账户密码登录" />
        </Tabs>

        {loginType === ELoginType.Password && (
          <>
            <ProFormText
              name="username"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={styles.prefixIcon} />,
              }}
              placeholder="登录名"
              rules={[
                {
                  required: true,
                  message: '请输入登录名',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={styles.prefixIcon} />,
              }}
              placeholder="登录密码"
              rules={[
                {
                  required: true,
                  message: '请输入登录密码',
                },
              ]}
            />
            {!isDev && (
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <MailOutlined className={styles.prefixIcon} />,
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder="请输入验证码"
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} 秒后重新获取`;
                  }
                  return '获取验证码';
                }}
                phoneName="username"
                name="vcode"
                rules={[
                  {
                    required: true,
                    message: '请输入验证码',
                  },
                ]}
                onGetCaptcha={async (username) => {
                  const { success } = await queryPhoneCaptchaByUsername(username);
                  if (success === false) {
                    message.error('获取验证码错误');
                    throw new Error('获取验证码错误');
                  }
                  message.success('获取验证码成功');
                }}
              />
            )}
          </>
        )}

        {loginType === ELoginType.Phone && (
          <>
            <ProFormText
              fieldProps={{
                size: 'large',
                prefix: <MobileOutlined className={styles.prefixIcon} />,
              }}
              name="mobile"
              placeholder="手机号"
              validateFirst
              rules={[
                {
                  required: true,
                  message: '请输入手机号',
                },
                {
                  pattern: phoneReg,
                  message: '不合法的手机号',
                },
              ]}
            />
            <ProFormCaptcha
              fieldProps={{
                size: 'large',
                prefix: <MailOutlined className={styles.prefixIcon} />,
              }}
              captchaProps={{
                size: 'large',
              }}
              placeholder="请输入验证码"
              captchaTextRender={(timing, count) => {
                if (timing) {
                  return `${count} 秒后重新获取`;
                }
                return '获取验证码';
              }}
              phoneName="mobile"
              name="code"
              rules={[
                {
                  required: true,
                  message: '请输入验证码',
                },
              ]}
              onGetCaptcha={async (mobile) => {
                const { success } = await queryPhoneCaptcha(mobile);
                if (success === false) {
                  message.error('获取验证码错误');
                  throw new Error('获取验证码错误');
                }
                message.success('获取验证码成功');
              }}
            />
          </>
        )}
      </ModalForm>
    </>
  );
};

export default connect(({ loading }: ConnectState) => ({
  submitting: loading.effects['loginModel/login'],
}))(LoginModal);
