/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg =
  /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const phoneReg =
  /^1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/;

export const passwordReg =
  /^\S*(?=\S{6,20})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])(?=\S*[!@#$%^&*?])\S*$/;
export const passwordMsg =
  '长度6-20，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符（例如：!@#$%^&*?）';

export const usernameReg = /^[a-zA-Z0-9_-]{4,16}$/;
export const usernameMsg = '只允许输入数字、英文字母、下划线和减号，长度限制为4-16个字符';

export function getBase64(img: any, callback: (base64: FileReader['result']) => void) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

export function isSystemPage() {
  return window.location.href.includes('/system');
}

export function getPagePath() {
  return window.location.href.split('?')[0];
}

/**
 * 随机生成密钥
 * @param {*} length 密钥长度
 */
export function randomSecret(length = 32) {
  let randomString = '';
  // 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678-_@';
  const charsLength = chars.length;
  for (let i = 0; i < length; i += 1) {
    randomString += chars.charAt(Math.floor(Math.random() * charsLength));
  }
  return randomString;
}

export function parseArray(str: string): any[] {
  let res = [];
  try {
    res = JSON.parse(str);
  } catch (error) {
    res = [];
  }
  return res;
}

export function parseObj(str: string): Record<string, any> {
  let res = {};
  try {
    res = JSON.parse(str);
  } catch (error) {
    res = {};
  }
  return res;
}
