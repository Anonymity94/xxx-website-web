import { history } from '@/.umi/core/history';
import { API_PREFIX, OPEN_API_PREFIX } from '@/appConfig';
import type { IAjaxResponseFactory } from '@/data-typings';
import { message, notification } from 'antd';
import $ from 'jquery';
import { getPagePath, isSystemPage } from './utils';

export interface IAjaxMap {
  pagePath: string;
  apiUri: string;
  ajax: JQueryXHR;
}
window.cancelRequest = new Map<symbol, IAjaxMap>();

const isDev = process.env.NODE_ENV === 'development';

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function ajax(url: string, options?: JQueryAjaxSettings) {
  let newUrl = url;

  // 排除login、logout
  if (newUrl === '/login' || newUrl === '/logout') {
    // 不做处理
    newUrl = `${isDev ? '/api' : ''}${newUrl}`;
  } else if (!newUrl.includes(OPEN_API_PREFIX) && !newUrl.includes(API_PREFIX)) {
    newUrl = `${API_PREFIX}${url}`;
  }

  const defaultOptions = {
    cache: false,
    credentials: 'include',
  };
  const newOptions = { url: newUrl, ...defaultOptions, ...options } as JQueryAjaxSettings;

  const promise: Promise<IAjaxResponseFactory<any>> = new Promise((resolve, reject) => {
    const ajaxRequest = $.ajax({
      ...newOptions,
    })
      .done((result) => {
        resolve({
          status: 200,
          success: true,
          result,
        });
      })
      // eslint-disable-next-line no-unused-vars
      .fail((xhr) => {
        const { responseText, responseJSON } = xhr;
        const errortext = responseText || (responseJSON ? responseJSON.message : xhr.statusText);

        const errorMsg = {
          code: responseJSON && responseJSON.code,
          success: false,
          status: xhr.status,
          msg: errortext,
          result: xhr.responseText,
        };
        console.log(errorMsg)
        reject(errorMsg);
      });

    // 当前登录用户信息等排除掉
    if (newUrl.indexOf('/current-users') === -1) {
      const pagePath = getPagePath();
      window.cancelRequest.set(Symbol(Date.now()), {
        pagePath,
        apiUri: newUrl,
        ajax: ajaxRequest,
      });
    }
  });

  return promise
    .then((data) => data)
    .catch((e) => {
      const { status, msg } = e;

      // 当前不在管理员页面下，不用处理
      if (!isSystemPage()) {
        return e;
      }

      if (status === 401 || status === 403) {
        if (newUrl === '/login' || newUrl === '/logout') {
          console.log('登录失败');
        } else {
          message.warning('尚未登录');
          // 跳转到登录界面
          history.push('/system/login');
        }
        // 清空用户信息
      } else if ((status <= 504 && status >= 500) || (status >= 400 && status < 422)) {
        notification.error({
          message: '出现了一个问题',
          description: msg,
        });
      }

      return e;
    });
}
