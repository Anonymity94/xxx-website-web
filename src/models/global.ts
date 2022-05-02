import { queryPhoneCaptcha } from '@/services';
import { uploadFile } from '@/services/global';
import type { IAjaxMap } from '@/utils/ajax';
import { getPagePath } from '@/utils/utils';
import type { Dispatch, Effect, History } from 'umi';

export type GlobalModelState = Record<string, any>;
export type Subscription = ({
  dispatch,
  history,
}: {
  dispatch: Dispatch;
  history: History;
}) => void;

export type GlobalModelType = {
  namespace: 'globalModel';
  state: GlobalModelState;
  effects: {
    uploadFile: Effect;
    queryPhoneCaptcha: Effect;
  };
  subscriptions: {
    setupRequestCancel: Subscription;
  };
};

const GlobalModel: GlobalModelType = {
  state: {},
  namespace: 'globalModel',

  effects: {
    *uploadFile({ payload }, { call }) {
      const response = yield call(uploadFile, payload);
      return response;
    },
    *queryPhoneCaptcha({ payload }, { call }) {
      const response = yield call(queryPhoneCaptcha, payload);
      return response;
    },
  },
  subscriptions: {
    setupRequestCancel({ history }) {
      history.listen(() => {
        const { cancelRequest = new Map<symbol, IAjaxMap>() } = window;
        const pagePath = getPagePath();
        cancelRequest.forEach((value: IAjaxMap, key: symbol) => {
          if (value.pagePath !== pagePath) {
            if (value.ajax) {
              value.ajax.abort();
            }
            cancelRequest.delete(key);
          }
        });
      });
    },
  },
};

export default GlobalModel;
