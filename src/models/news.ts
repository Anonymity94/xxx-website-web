import type { INews, INewsQueryParams, IPageFactory, IAjaxResponseFactory } from '@/data-typings';
import { EStatus } from '@/data-typings';
import { initPage } from '@/dict';
import { createOrUpdateNews, deleteNews, queryNews, queryNewsDetail } from '@/services/news';
import type { PaginationProps } from 'antd';
import { message } from 'antd';
import type { Effect, Reducer } from 'umi';

export type NewsModelState = {
  list: INews[];
  detail: INews;
  page: PaginationProps;

  hotNewsList: INews[];
};

export type NewsModelType = {
  namespace: 'newsModel';
  state: NewsModelState;
  effects: {
    queryNews: Effect;
    queryHotNews: Effect;
    queryNewsDetail: Effect;
    createOrUpdateNews: Effect;
    deleteNews: Effect;
  };
  reducers: {
    updateState: Reducer<NewsModelState>;
  };
};

const NewsModel: NewsModelType = {
  namespace: 'newsModel',

  state: {
    list: [],
    hotNewsList: [],
    detail: <INews>{},
    page: initPage,
  },
  effects: {
    *queryNews({ payload }, { call, put }) {
      const { success, result }: IAjaxResponseFactory<IPageFactory<INews>> = yield call(
        queryNews,
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
    *queryHotNews({ payload }, { call, put }) {
      const { success, result }: IAjaxResponseFactory<IPageFactory<INews>> = yield call(queryNews, {
        page: 0,
        size: payload.count || 6,
        status: EStatus.Open,
      } as INewsQueryParams);
      yield put({
        type: 'updateState',
        payload: {
          hotNewsList: success ? result.content : [],
        },
      });
    },
    *queryNewsDetail({ payload }, { call, put }) {
      const { success, result }: IAjaxResponseFactory<INews> = yield call(queryNewsDetail, payload);
      yield put({
        type: 'updateState',
        payload: {
          detail: success ? result : {},
        },
      });
    },
    *createOrUpdateNews({ payload }, { call }) {
      const { success }: IAjaxResponseFactory<any> = yield call(createOrUpdateNews, payload);
      const type = payload.id ? '编辑' : '新建';
      if (success) {
        message.success(`${type}成功`);
      } else {
        message.error(`${type}失败`);
      }
      return success;
    },
    *deleteNews({ payload }, { call }) {
      const { success }: IAjaxResponseFactory<any> = yield call(deleteNews, payload);
      if (success) {
        message.success(`删除成功`);
      } else {
        message.error(`删除失败`);
      }
      return success;
    },
  },

  reducers: {
    updateState(state, { payload = {} }): NewsModelState {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default NewsModel;
