import type {
  IContract,
  IContractCategory,
  IContractCategoryMap,
  IContractSubCategory,
  IContractSubCategoryMap,
  IPageFactory,
  IAjaxResponseFactory,
} from '@/data-typings';
import { EBoolean, EStatus } from '@/data-typings';
import { initPage } from '@/dict';
import {
  createOrUpdateContract,
  createOrUpdateContractCategory,
  createOrUpdateContractSubCategory,
  deleteContract,
  deleteContractCategory,
  deleteContractSubCategory,
  queryContractCategories,
  queryContractCategoryDetail,
  queryContractDetail,
  queryContracts,
  queryContractSubCategories,
  queryContractSubCategoryDetail,
} from '@/services';
import type { PaginationProps } from 'antd';
import { message } from 'antd';
import type { Effect, Reducer } from 'umi';

export type ContractModelState = {
  // 合同大类
  categoryList: IContractCategory[];
  categoryMap: IContractCategoryMap;
  categoryDetail: IContractCategory;

  // 合同子类
  subCategoryList: IContractSubCategory[];
  subCategoryMap: IContractSubCategoryMap;
  subCategoryDetail: IContractSubCategory;

  // 合同
  contractList: IContract[];
  hotContractList: IContract[];
  contractDetail: IContract;
  /** 合同分页 */
  contractPage: PaginationProps;
};

export type ContractModelType = {
  namespace: 'contractModel';
  state: ContractModelState;
  effects: {
    queryContractCategories: Effect;
    queryContractCategoryDetail: Effect;
    createOrUpdateContractCategory: Effect;
    deleteContractCategory: Effect;

    queryContractSubCategories: Effect;
    queryContractSubCategoryDetail: Effect;
    createOrUpdateContractSubCategory: Effect;
    deleteContractSubCategory: Effect;

    queryCategoryAndSubCategory: Effect;

    queryContracts: Effect;
    queryHotContracts: Effect;
    queryContractDetail: Effect;
    createOrUpdateContract: Effect;
    deleteContract: Effect;
  };
  reducers: {
    updateState: Reducer<ContractModelState>;
  };
};

const ContractModel: ContractModelType = {
  namespace: 'contractModel',

  state: {
    categoryList: [],
    categoryMap: <IContractCategoryMap>{},
    categoryDetail: <IContractCategory>{},

    subCategoryList: [],
    subCategoryMap: <IContractSubCategoryMap>{},
    subCategoryDetail: <IContractSubCategory>{},

    contractList: [],
    hotContractList: [],
    contractDetail: <IContract>{},
    contractPage: initPage,
  },
  effects: {
    *queryContractCategories({ payload }, { call, put }) {
      const { success, result }: IAjaxResponseFactory<IContractCategory[]> = yield call(
        queryContractCategories,
        payload,
      );
      const categoryList = success && Array.isArray(result) ? result : [];
      const categoryMap: IContractCategoryMap = {};
      categoryList.forEach((item) => {
        categoryMap[item.id] = item;
      });

      yield put({
        type: 'updateState',
        payload: {
          categoryList,
          categoryMap,
        },
      });
    },
    *queryContractCategoryDetail({ payload }, { call, put }) {
      const { success, result }: IAjaxResponseFactory<IContractCategory> = yield call(
        queryContractCategoryDetail,
        payload,
      );
      yield put({
        type: 'updateState',
        payload: {
          categoryDetail: success ? result : {},
        },
      });
    },
    *createOrUpdateContractCategory({ payload }, { call }) {
      const { success }: IAjaxResponseFactory<any> = yield call(
        createOrUpdateContractCategory,
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
    *deleteContractCategory({ payload }, { call }) {
      const { success }: IAjaxResponseFactory<any> = yield call(deleteContractCategory, payload);
      if (success) {
        message.success(`删除成功`);
      } else {
        message.error(`删除失败`);
      }
      return success;
    },
    // --------
    *queryContractSubCategories({ payload }, { call, put }) {
      const { success, result }: IAjaxResponseFactory<IContractSubCategory[]> = yield call(
        queryContractSubCategories,
        payload,
      );

      const subCategoryList = success && Array.isArray(result) ? result : [];
      const subCategoryMap: IContractSubCategoryMap = {};
      subCategoryList.forEach((item) => {
        subCategoryMap[item.id] = item;
      });

      yield put({
        type: 'updateState',
        payload: {
          subCategoryList,
          subCategoryMap,
        },
      });
    },
    *queryContractSubCategoryDetail({ payload }, { call, put }) {
      const { success, result }: IAjaxResponseFactory<IContractSubCategory> = yield call(
        queryContractSubCategoryDetail,
        payload,
      );
      yield put({
        type: 'updateState',
        payload: {
          subCategoryDetail: success ? result : {},
        },
      });
    },
    *createOrUpdateContractSubCategory({ payload }, { call }) {
      const { success }: IAjaxResponseFactory<any> = yield call(
        createOrUpdateContractSubCategory,
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
    *deleteContractSubCategory({ payload }, { call }) {
      const { success }: IAjaxResponseFactory<any> = yield call(deleteContractSubCategory, payload);
      if (success) {
        message.success(`删除成功`);
      } else {
        message.error(`删除失败`);
      }
      return success;
    },
    // --------

    *queryCategoryAndSubCategory(_, { put }) {
      yield put({ type: 'queryContractCategories' });
      yield put({ type: 'queryContractSubCategories' });
    },
    // --------
    *queryContracts({ payload }, { call, put }) {
      const { success, result }: IAjaxResponseFactory<IPageFactory<IContract>> = yield call(
        queryContracts,
        payload,
      );
      if (!success) {
        return;
      }
      yield put({
        type: 'updateState',
        payload: {
          contractList: result.content,
          contractPage: {
            current: result.number + 1,
            total: result.totalElements,
            pageSize: result.size,
          },
        },
      });
    },
    *queryHotContracts({ payload }, { call, put }) {
      const { success, result }: IAjaxResponseFactory<IPageFactory<IContract>> = yield call(
        queryContracts,
        {
          size: payload.count || 6,
          page: 0,
          status: EStatus.Open,
          isHot: EBoolean.True,
        },
      );
      yield put({
        type: 'updateState',
        payload: {
          hotContractList: success ? result.content : [],
        },
      });
    },
    *queryContractDetail({ payload }, { call, put }) {
      const { success, result }: IAjaxResponseFactory<IContract> = yield call(
        queryContractDetail,
        payload,
      );
      yield put({
        type: 'updateState',
        payload: {
          contractDetail: success ? result : {},
        },
      });
    },
    *createOrUpdateContract({ payload }, { call }) {
      const { success }: IAjaxResponseFactory<any> = yield call(createOrUpdateContract, payload);
      const type = payload.id ? '编辑' : '新建';
      if (success) {
        message.success(`${type}成功`);
      } else {
        message.error(`${type}失败`);
      }
      return success;
    },
    *deleteContract({ payload }, { call }) {
      const { success }: IAjaxResponseFactory<any> = yield call(deleteContract, payload);
      if (success) {
        message.success(`删除成功`);
      } else {
        message.error(`删除失败`);
      }
      return success;
    },
  },

  reducers: {
    updateState(state, { payload = {} }): ContractModelState {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default ContractModel;
