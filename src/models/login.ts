import { outLogin, userLogin } from '@/services';
import type { Effect, Reducer } from 'umi';

export type LoginModelState = Record<string, any>;

export type LoginModelType = {
  namespace: 'loginModel';
  state: LoginModelState;
  effects: {
    login: Effect;
    outLogin: Effect;
  };
  reducers: {
    updateState: Reducer<LoginModelState>;
  };
};

const LoginModel: LoginModelType = {
  namespace: 'loginModel',

  state: {},
  effects: {
    *login({ payload }, { call }) {
      const response = yield call(userLogin, payload);
      return response;
    },
    *outLogin({ payload }, { call }) {
      const response = yield call(outLogin, payload);
      return response;
    },
  },

  reducers: {
    updateState(state, { payload = {} }): LoginModelState {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default LoginModel;
