import type { IUser, IPageFactory, IAjaxResponseFactory } from '@/data-typings';
import { initPage } from '@/dict';
import { createOrUpdateUser, deleteUser, queryUserDetail, queryUsers } from '@/services';
import type { PaginationProps } from 'antd';
import { message } from 'antd';
import type { Effect, Reducer } from 'umi';

export type UserModelState = {
  list: IUser[];
  detail: IUser;
  page: PaginationProps;
};

export type UserModelType = {
  namespace: 'userModel';
  state: UserModelState;
  effects: {
    queryUsers: Effect;
    queryUserDetail: Effect;
    createOrUpdateUser: Effect;
    deleteUser: Effect;
  };
  reducers: {
    updateState: Reducer<UserModelState>;
  };
};

const UserModel: UserModelType = {
  namespace: 'userModel',

  state: {
    list: [],
    detail: <IUser>{},
    page: initPage,
  },
  effects: {
    *queryUsers({ payload }, { call, put }) {
      const { success, result }: IAjaxResponseFactory<IPageFactory<IUser>> = yield call(
        queryUsers,
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
    *queryUserDetail({ payload }, { call, put }) {
      const { success, result }: IAjaxResponseFactory<IUser> = yield call(queryUserDetail, payload);
      yield put({
        type: 'updateState',
        payload: {
          detail: success ? result : {},
        },
      });
    },
    *createOrUpdateUser({ payload }, { call }) {
      const { success }: IAjaxResponseFactory<any> = yield call(createOrUpdateUser, payload);
      const type = payload.id ? '编辑' : '新建';
      if (success) {
        message.success(`${type}成功`);
      } else {
        message.error(`${type}失败`);
      }
      return success;
    },
    *deleteUser({ payload }, { call }) {
      const { success }: IAjaxResponseFactory<any> = yield call(deleteUser, payload);
      if (success) {
        message.success(`删除成功`);
      } else {
        message.error(`删除失败`);
      }
      return success;
    },
  },

  reducers: {
    updateState(state, { payload = {} }): UserModelState {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default UserModel;
