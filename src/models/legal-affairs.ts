import type { ILegalAffairs, IPageFactory, IAjaxResponseFactory } from '@/data-typings';
import { initPage } from '@/dict';
import {
  createOrUpdateLegalAffairs,
  deleteLegalAffairs,
  queryLegalAffairsDetail,
  queryLegalAffairs,
} from '@/services';
import type { PaginationProps } from 'antd';
import { message } from 'antd';
import type { Effect, Reducer } from 'umi';

export type LegalAffairsModelState = {
  list: ILegalAffairs[];
  detail: ILegalAffairs;
  page: PaginationProps;
};

export type LegalAffairsModelType = {
  namespace: 'legalAffairsModel';
  state: LegalAffairsModelState;
  effects: {
    queryLegalAffairs: Effect;
    queryLegalAffairsDetail: Effect;
    createOrUpdateLegalAffairs: Effect;
    deleteLegalAffairs: Effect;
  };
  reducers: {
    updateState: Reducer<LegalAffairsModelState>;
  };
};

const LegalAffairsModel: LegalAffairsModelType = {
  namespace: 'legalAffairsModel',

  state: {
    list: [],
    detail: <ILegalAffairs>{},
    page: initPage,
  },
  effects: {
    *queryLegalAffairs({ payload }, { call, put }) {
      const { success, result }: IAjaxResponseFactory<IPageFactory<ILegalAffairs>> = yield call(
        queryLegalAffairs,
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
    *queryLegalAffairsDetail({ payload }, { call, put }) {
      const { success, result }: IAjaxResponseFactory<ILegalAffairs> = yield call(
        queryLegalAffairsDetail,
        payload,
      );
      yield put({
        type: 'updateState',
        payload: {
          detail: success ? result : {},
        },
      });
    },
    *createOrUpdateLegalAffairs({ payload }, { call }) {
      const { success }: IAjaxResponseFactory<any> = yield call(createOrUpdateLegalAffairs, payload);
      const type = payload.id ? '编辑' : '新建';
      if (success) {
        message.success(`${type}成功`);
      } else {
        message.error(`${type}失败`);
      }
      return success;
    },
    *deleteLegalAffairs({ payload }, { call }) {
      const { success }: IAjaxResponseFactory<any> = yield call(deleteLegalAffairs, payload);
      if (success) {
        message.success(`删除成功`);
      } else {
        message.error(`删除失败`);
      }
      return success;
    },
  },

  reducers: {
    updateState(state, { payload = {} }): LegalAffairsModelState {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default LegalAffairsModel;
