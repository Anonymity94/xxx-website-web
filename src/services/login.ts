// @ts-ignore
/* eslint-disable */
import { OPEN_API_PREFIX } from '@/appConfig';
import { EBoolean } from '@/data-typings';
import ajax from '@/utils/ajax';

interface ILoginParams {
  /** 是手机的话，username手机号  passward 验证码 */
  isphone: EBoolean;
  username: string;
  password: string;
}

/** 用户登录 */
export async function userLogin(params: ILoginParams) {
  console.log(params);
  return ajax(`/login`, {
    type: 'POST',
    data: params,
  });
}

/** 退出登录接口 */
export async function outLogin() {
  return ajax(`/logout`, {
    type: 'POST',
    data: {},
  });
}

/** 发送验证码 */
export async function queryPhoneCaptcha(telephone: string) {
  return ajax(`${OPEN_API_PREFIX}/user/send/${telephone}`);
}

/** 根据用户名发送验证码 */
export async function queryPhoneCaptchaByUsername(username: string) {
  return ajax(`${OPEN_API_PREFIX}/login/send/${username}`);
}

/** 获取当前登陆人 */
export async function queryCurrentUser() {
  return ajax(`/user/current-users`);
}
