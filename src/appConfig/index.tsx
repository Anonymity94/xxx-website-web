export const isDev = process.env.NODE_ENV === 'development';

/** 环境前缀 */
const DEV_PREFIX = isDev ? '/api' : '';
/** 静态资源前缀 */
const STATIC_PATH = `${DEV_PREFIX}/web-static`;
/** API前缀信息 */
export const API_PREFIX = `${DEV_PREFIX}/web-api/v1`;
export const OPEN_API_PREFIX = `${DEV_PREFIX}/open-api/v1`;
/** 公开文件上传接口 */
export const UPLOAD_FILE_API = `${API_PREFIX}/file/upload`;
/** 私密文件上传接口 */
export const UPLOAD_PRIVATE_FILE_API = `${API_PREFIX}/file/private-upload/`;
/** 上传文件的前缀 */
export const UPLOAD_FILE_PATH_PREFIX = `${STATIC_PATH}/upload/`;
/** 聊天中上传文件的前缀 */
export const CHAT_FILE_PATH_PREFIX = `${STATIC_PATH}/upload/chatfile/`;

/** 产品名称 */
export const PRODUCT_NAME = '产品名称';
/** 版权 */
export const PRODUCT_COPYRIGHT = '产品版权';
/** 产品名称 */
export const PRODUCT_LOGO = `${STATIC_PATH}/logo.png`;

/** 聊天后台地址 */
export const WEBSOCKET_URI = isDev ? 'ws://ip:port' : 'wss://ip:port';
