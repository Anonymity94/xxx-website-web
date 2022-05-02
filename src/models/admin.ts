import type { IAdmin, IPageFactory, IAjaxResponseFactory } from '@/data-typings';
import { initPage } from '@/dict';
import { createOrUpdateAdmin, deleteAdmin, queryAdminDetail, queryAdmins } from '@/services';
import type { PaginationProps } from 'antd';
import { message } from 'antd';
import type { Effect, Reducer } from 'umi';

export type AdminModelState = {
  list: IAdmin[];
  detail: IAdmin;
  page: PaginationProps;
};

export type AdminModelType = {
  namespace: 'adminModel';
  state: AdminModelState;
  effects: {
    queryAdmins: Effect;
    queryAdminDetail: Effect;
    createOrUpdateAdmin: Effect;
    deleteAdmin: Effect;
  };
  reducers: {
    updateState: Reducer<AdminModelState>;
  };
};

const AdminModel: AdminModelType = {
  namespace: 'adminModel',

  state: {
    list: [],
    detail: <IAdmin>{},
    page: initPage,
  },
  effects: {
    *queryAdmins({ payload }, { call, put }) {
      const { success, result }: IAjaxResponseFactory<IPageFactory<IAdmin>> = yield call(
        queryAdmins,
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
    *queryAdminDetail({ payload }, { call, put }) {
      const { success, result }: IAjaxResponseFactory<IAdmin> = yield call(queryAdminDetail, payload);
      yield put({
        type: 'updateState',
        payload: {
          detail: success ? result : {},
        },
      });
    },
    *createOrUpdateAdmin({ payload }, { call }) {
      const { success }: IAjaxResponseFactory<any> = yield call(createOrUpdateAdmin, payload);
      const type = payload.id ? '编辑' : '新建';
      if (success) {
        message.success(`${type}成功`);
      } else {
        message.error(`${type}失败`);
      }
      return success;
    },
    *deleteAdmin({ payload }, { call }) {
      const { success }: IAjaxResponseFactory<any> = yield call(deleteAdmin, payload);
      if (success) {
        message.success(`删除成功`);
      } else {
        message.error(`删除失败`);
      }
      return success;
    },
  },

  reducers: {
    updateState(state, { payload = {} }): AdminModelState {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default AdminModel;
