import type { ILawyer, IPageFactory, IAjaxResponseFactory } from '@/data-typings';
import { EStatus } from '@/data-typings';
import { initPage } from '@/dict';
import {
  createOrUpdateLawyer,
  deleteLawyer,
  queryLawyerDetail,
  queryLawyers,
  updateLawyer,
} from '@/services';
import type { PaginationProps } from 'antd';
import { message } from 'antd';
import type { Effect, Reducer } from 'umi';

export type LawyerModelState = {
  list: ILawyer[];
  detail: ILawyer;
  page: PaginationProps;

  hotLawyerList: ILawyer[];
};

export type LawyerModelType = {
  namespace: 'lawyerModel';
  state: LawyerModelState;
  effects: {
    queryLawyers: Effect;
    queryHotLawyers: Effect;
    queryLawyerDetail: Effect;
    createOrUpdateLawyer: Effect;
    updateLawyer: Effect;
    deleteLawyer: Effect;
  };
  reducers: {
    updateState: Reducer<LawyerModelState>;
  };
};

const LawyerModel: LawyerModelType = {
  namespace: 'lawyerModel',

  state: {
    list: [],
    hotLawyerList: [],
    detail: <ILawyer>{},
    page: initPage,
  },
  effects: {
    *queryLawyers({ payload }, { call, put }) {
      const { success, result }: IAjaxResponseFactory<IPageFactory<ILawyer>> = yield call(
        queryLawyers,
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
    *queryHotLawyers({ payload }, { call, put }) {
      const { success, result }: IAjaxResponseFactory<IPageFactory<ILawyer>> = yield call(
        queryLawyers,
        { size: payload.count || 6, page: 0, status: EStatus.Open },
      );
      yield put({
        type: 'updateState',
        payload: {
          hotLawyerList: success ? result.content : [],
        },
      });
    },
    *queryLawyerDetail({ payload }, { call, put }) {
      const { success, result }: IAjaxResponseFactory<ILawyer> = yield call(queryLawyerDetail, payload);
      yield put({
        type: 'updateState',
        payload: {
          detail: success ? result : {},
        },
      });
    },
    *createOrUpdateLawyer({ payload }, { call }) {
      const { success, result }: IAjaxResponseFactory<any> = yield call(createOrUpdateLawyer, payload);
      const type = payload.id ? '编辑' : '新建';
      if (success) {
        message.success(`${type}成功`);
      } else {
        message.error(`${type}失败${result && `: ${result}`}`);
      }
      return success;
    },
    *updateLawyer({ payload }, { call }) {
      const { success }: IAjaxResponseFactory<any> = yield call(updateLawyer, payload);
      if (success) {
        message.success(`编辑成功`);
      } else {
        message.error(`编辑失败`);
      }
      return success;
    },
    *deleteLawyer({ payload }, { call }) {
      const { success }: IAjaxResponseFactory<any> = yield call(deleteLawyer, payload);
      if (success) {
        message.success(`删除成功`);
      } else {
        message.error(`删除失败`);
      }
      return success;
    },
  },

  reducers: {
    updateState(state, { payload = {} }): LawyerModelState {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default LawyerModel;
