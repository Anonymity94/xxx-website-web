import type { ICustomerService, IPageFactory, IAjaxResponseFactory } from '@/data-typings';
import { initPage } from '@/dict';
import {
  createOrUpdateCustomerService,
  deleteCustomerService,
  queryCustomerServiceDetail,
  queryCustomerServices,
} from '@/services';
import type { PaginationProps } from 'antd';
import { message } from 'antd';
import type { Effect, Reducer } from 'umi';

export type CustomerServiceModelState = {
  list: ICustomerService[];
  detail: ICustomerService;
  page: PaginationProps;
};

export type CustomerServiceModelType = {
  namespace: 'customerServiceModel';
  state: CustomerServiceModelState;
  effects: {
    queryCustomerServices: Effect;
    queryCustomerServiceDetail: Effect;
    createOrUpdateCustomerService: Effect;
    deleteCustomerService: Effect;
  };
  reducers: {
    updateState: Reducer<CustomerServiceModelState>;
  };
};

const CustomerServiceModel: CustomerServiceModelType = {
  namespace: 'customerServiceModel',

  state: {
    list: [],
    detail: <ICustomerService>{},
    page: initPage,
  },
  effects: {
    *queryCustomerServices({ payload }, { call, put }) {
      const { success, result }: IAjaxResponseFactory<IPageFactory<ICustomerService>> = yield call(
        queryCustomerServices,
        payload,
      );
      if (!success) {
        return;
      }
      yield put({
        type: 'updateState',
        payload: {
          list: result.content,
          page: {
            current: result.number + 1,
            total: result.totalElements,
            pageSize: result.size,
          },
        },
      });
    },
    *queryCustomerServiceDetail({ payload }, { call, put }) {
      const { success, result }: IAjaxResponseFactory<ICustomerService> = yield call(
        queryCustomerServiceDetail,
        payload,
      );
      yield put({
        type: 'updateState',
        payload: {
          detail: success ? result : {},
        },
      });
    },
    *createOrUpdateCustomerService({ payload }, { call }) {
      const { success }: IAjaxResponseFactory<any> = yield call(createOrUpdateCustomerService, payload);
      const type = payload.id ? '??????' : '??????';
      if (success) {
        message.success(`${type}??????`);
      } else {
        message.error(`${type}??????`);
      }
      return success;
    },
    *deleteCustomerService({ payload }, { call }) {
      const { success }: IAjaxResponseFactory<any> = yield call(deleteCustomerService, payload);
      if (success) {
        message.success(`????????????`);
      } else {
        message.error(`????????????`);
      }
      return success;
    },
  },

  reducers: {
    updateState(state, { payload = {} }): CustomerServiceModelState {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default CustomerServiceModel;
