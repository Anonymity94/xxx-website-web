import type { ICurrentUser } from './data-typings';
import { EUserRole } from './data-typings';

/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: ICurrentUser | undefined }) {
  const { currentUser } = initialState;

  // 登录标志
  let isLogin = false;
  // 管理员
  let isAdmin = false;
  // 一般的用户
  let isUser = false;
  // 律师
  let isLawyer = false;
  // 法务
  let isLegalAffairs = false;
  // 企业用户
  let isCompanyUser = false;
  //  客服人员
  let isCustomerService = false;

  if (currentUser && currentUser.id) {
    isLogin = true;

    // 解析权限
    const { role } = currentUser;

    switch (role) {
      case EUserRole.ADMIN:
        isAdmin = true;
        break;

      case EUserRole.COMPANY_USER:
        isCompanyUser = true;
        break;

      case EUserRole.CUSTOMER_SERVICE:
        isCustomerService = true;
        break;

      case EUserRole.LAWYER:
        isLawyer = true;
        break;

      case EUserRole.LEGAL_AFFAIRS:
        isLegalAffairs = true;
        break;

      case EUserRole.USER:
        isUser = true;
        break;

      default:
        break;
    }
  }

  return {
    /** 是否登录 */
    isLogin,
    /** 管理员 */
    isAdmin,
    /** 普通用户 */
    isUser,
    /** 律师 */
    isLawyer,
    /** 法务 */
    isLegalAffairs,
    /** 企业用户 */
    isCompanyUser,
    /** 客服 */
    isCustomerService,
  };
}
