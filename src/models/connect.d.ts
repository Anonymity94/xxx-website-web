import type { MenuDataItem } from '@ant-design/pro-layout';
import type { AnyAction } from 'redux';
import type {
  AdminModelState,
  CompanyUserModelState,
  ContractModelState,
  CustomerServiceModelState,
  GlobalModelState,
  LawyerModelState,
  LegalAffairsModelState,
  NewsModelState,
  RouterTypes,
  UserModelState,
  LoginModelState,
  LegalAffairsServiceModelState,
} from 'umi';

export { NewsModelState, LawyerModelState };

export interface Loading {
  effects: Record<string, boolean | undefined>;
  models: {
    userModel: boolean;
    adminModel: boolean;
    lawyerModel: boolean;
    companyUserModel: boolean;
    customerServiceModel: boolean;
    legalAffairsModel: boolean;
    globalModel: boolean;
    contractModel: boolean;
    newsModel: boolean;
  };
}

export interface ConnectState {
  loading: Loading;

  userModel: UserModelState;
  adminModel: AdminModelState;
  lawyerModel: LawyerModelState;
  companyUserModel: CompanyUserModelState;
  customerServiceModel: CustomerServiceModelState;
  legalAffairsModel: LegalAffairsModelState;
  legalAffairsServiceModel: LegalAffairsServiceModelState;
  globalModel: GlobalModelState;
  contractModel: ContractModelState;
  newsModel: NewsModelState;
  loginModel: LoginModelState;
}

export interface Route extends MenuDataItem {
  routes?: Route[];
}

/**
 * @type T: Params matched in dynamic routing
 */
export interface ConnectProps<T = {}> extends Partial<RouterTypes<Route, T>> {
  dispatch?: Dispatch<AnyAction>;
}
