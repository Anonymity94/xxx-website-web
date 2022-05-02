import type { ILegalAffairsService, IAjaxResponseFactory } from '@/data-typings';
import {
  createOrUpdateLegalAffairsService,
  deleteLegalAffairsService,
  queryLegalAffairsService,
  queryLegalAffairsServiceDetail,
} from '@/services';
import { message } from 'antd';
import type { Effect, Reducer } from 'umi';

export type LegalAffairsServiceModelState = {
  list: ILegalAffairsService[];
  detail: ILegalAffairsService;
};

export type LegalAffairsServiceModelType = {
  namespace: 'legalAffairsServiceModel';
  state: LegalAffairsServiceModelState;
  effects: {
    queryLegalAffairsService: Effect;
    queryLegalAffairsServiceDetail: Effect;
    createOrUpdateLegalAffairsService: Effect;
    deleteLegalAffairsService: Effect;
  };
  reducers: {
    updateState: Reducer<LegalAffairsServiceModelState>;
  };
};

const LegalAffairsServiceModel: LegalAffairsServiceModelType = {
  namespace: 'legalAffairsServiceModel',

  state: {
    list: [],
    detail: <ILegalAffairsService>{},
  },
  effects: {
    *queryLegalAffairsService({ payload }, { call, put }) {
      const { success, result }: IAjaxResponseFactory<ILegalAffairsService[]> = yield call(
        queryLegalAffairsService,
        payload,
      );
      yield put({
        type: 'updateState',
        payload: {
          list: success ? result : [],
        },
      });
    },
    *queryLegalAffairsServiceDetail({ payload }, { call, put }) {
      const { success, result }: IAjaxResponseFactory<ILegalAffairsService> = yield call(
        queryLegalAffairsServiceDetail,
        payload,
      );
      yield put({
        type: 'updateState',
        payload: {
          detail: success ? result : {},
        },
      });
    },
    *createOrUpdateLegalAffairsService({ payload }, { call }) {
      const { success }: IAjaxResponseFactory<any> = yield call(
        createOrUpdateLegalAffairsService,
        payload,
      );
      const type = payload.id ? '编辑' : '新建';
      if (success) {
        message.success(`${type}成功`);
      } else {
        message.error(`${type}失败`);
      }
      return success;
    },
    *deleteLegalAffairsService({ payload }, { call }) {
      const { success }: IAjaxResponseFactory<any> = yield call(deleteLegalAffairsService, payload);
      if (success) {
        message.success(`删除成功`);
      } else {
        message.error(`删除失败`);
      }
      return success;
    },
  },

  reducers: {
    updateState(state, { payload = {} }): LegalAffairsServiceModelState {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default LegalAffairsServiceModel;
