import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import { message } from 'antd';
import { history } from 'umi';
import type { ICurrentUser, IAjaxResponseFactory } from './data-typings';
import { queryCurrentUser } from './services';
import { isSystemPage } from './utils/utils';

const adminLoginPath = '/system/login';

message.config({
  maxCount: 1,
});

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: ICurrentUser;
  /** 登录框显示状态 */
  loginModalVisible?: boolean;
  fetchUserInfo?: () => Promise<ICurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const { success, result }: IAjaxResponseFactory<ICurrentUser> = await queryCurrentUser();
      if (success) {
        return result;
      }
      if (isSystemPage()) {
        history.push(adminLoginPath);
      }
    } catch (error) {
      if (isSystemPage()) {
        history.push(adminLoginPath);
      }
    }
    return undefined;
  };
  // 如果是管理员登录页面，不执行
  if (history.location.pathname !== adminLoginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: {},
      loginModalVisible: false,
    };
  }
  return {
    fetchUserInfo,
    settings: {},
    loginModalVisible: false,
  };
}

/**
 * 异常处理程序
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    405: '请求方法不被允许。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
 //-----English
    200: The server successfully returned the requested data. ',
    201: New or modified data is successful. ',
    202: A request has entered the background queue (asynchronous task). ',
    204: Data deleted successfully. ',
    400: 'There was an error in the request sent, and the server did not create or modify data. ',
    401: The user does not have permission (token, username, password error). ',
    403: The user is authorized, but access is forbidden. ',
    404: The request sent was for a record that did not exist. ',
    405: The request method is not allowed. ',
    406: The requested format is not available. ',
    410':
        'The requested resource is permanently deleted and will no longer be available. ',
    422: When creating an object, a validation error occurred. ',
    500: An error occurred on the server, please check the server. ',
    502: Gateway error. ',
    503: The service is unavailable. ',
    504: The gateway timed out. ',
 * @see https://beta-pro.ant.design/docs/request-cn
 */
// export const request: RequestConfig = {
//   prefix: `${isDev ? '/api' : ''}/web-api/v1`,
//   headers: {
//     'Content-Type': 'multipart/form-data',
//     //   Accept: 'application/json',
//     //   'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
//   },
//   credentials: 'include', // 默认请求是否带上cookie
//   errorConfig: {
//     adaptor: (resData) => {
//       console.log(resData);
//       return {
//         ...resData,
//         success: resData.ok,
//         errorMessage: resData.message,
//       };
//     },
//   },
//   errorHandler: (error: any) => {
//     const { response } = error;

//     if (!response) {
//       notification.error({
//         description: '您的网络发生异常，无法连接服务器',
//         message: '网络异常',
//       });
//     }
//     throw error;
//   },
// };

// ProLayout 支持的api https://procomponents.ant.design/components/layout
// export const layout: RunTimeLayoutConfig = ({ initialState }) => {
//   return {
//     rightContentRender: () => <RightContent />,
//     disableContentMargin: false,
//     waterMarkProps: {
//       content: initialState?.currentUser?.name,
//     },
//     footerRender: () => <Footer />,
//     onPageChange: () => {
//       const { location } = history;
//       // 如果没有登录，重定向到 login
//       if (!initialState?.currentUser && location.pathname !== loginPath) {
//         history.push(loginPath);
//       }
//     },
//     links: isDev
//       ? [
//           <Link to="/umi/plugin/openapi" target="_blank">
//             <LinkOutlined />
//             <span>openAPI 文档</span>
//           </Link>,
//           <Link to="/~docs">
//             <BookOutlined />
//             <span>业务组件文档</span>
//           </Link>,
//         ]
//       : [],
//     menuHeaderRender: undefined,
//     // 自定义 403 页面
//     // unAccessible: <div>unAccessible</div>,
//     ...initialState?.settings,
//   };
// };
