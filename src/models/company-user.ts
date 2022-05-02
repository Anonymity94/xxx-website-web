import type { ICompanyUser, IPageFactory, IAjaxResponseFactory } from '@/data-typings';
import { initPage } from '@/dict';
import {
  createOrUpdateCompanyUser,
  deleteCompanyUser,
  queryCompanyUserDetail,
  queryCompanyUsers,
} from '@/services';
import type { PaginationProps } from 'antd';
import { message } from 'antd';
import type { Effect, Reducer } from 'umi';

export type CompanyUserModelState = {
  list: ICompanyUser[];
  detail: ICompanyUser;
  page: PaginationProps;
};

export type CompanyUserModelType = {
  namespace: 'companyUserModel';
  state: CompanyUserModelState;
  effects: {
    queryCompanyUsers: Effect;
    queryCompanyUserDetail: Effect;
    createOrUpdateCompanyUser: Effect;
    deleteCompanyUser: Effect;
  };
  reducers: {
    updateState: Reducer<CompanyUserModelState>;
  };
};

const CompanyUserModel: CompanyUserModelType = {
  namespace: 'companyUserModel',

  state: {
    list: [],
    detail: <ICompanyUser>{},
    page: initPage,
  },
  effects: {
    *queryCompanyUsers({ payload }, { call, put }) {
      const { success, result }: IAjaxResponseFactory<IPageFactory<ICompanyUser>> = yield call(
        queryCompanyUsers,
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
    *queryCompanyUserDetail({ payload }, { call, put }) {
      const { success, result }: IAjaxResponseFactory<ICompanyUser> = yield call(
        queryCompanyUserDetail,
        payload,
      );
      yield put({
        type: 'updateState',
        payload: {
          detail: success ? result : {},
        },
      });
    },
    *createOrUpdateCompanyUser({ payload }, { call }) {
      const { success }: IAjaxResponseFactory<any> = yield call(createOrUpdateCompanyUser, payload);
      const type = payload.id ? '编辑' : '新建';
      if (success) {
        message.success(`${type}成功`);
      } else {
        message.error(`${type}失败`);
      }
      return success;
    },
    *deleteCompanyUser({ payload }, { call }) {
      const { success }: IAjaxResponseFactory<any> = yield call(deleteCompanyUser, payload);
      if (success) {
        message.success(`删除成功`);
      } else {
        message.error(`删除失败`);
      }
      return success;
    },
  },

  reducers: {
    updateState(state, { payload = {} }): CompanyUserModelState {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default CompanyUserModel;
