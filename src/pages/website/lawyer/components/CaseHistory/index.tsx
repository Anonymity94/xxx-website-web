import { OPEN_API_PREFIX } from '@/appConfig';
import type {
  ILawyer,
  ILawyerCase,
  IPageFactory,
  IRecommendResource,
  IAjaxResponseFactory,
} from '@/data-typings';
import { ECaseStatus } from '@/data-typings';
import ajax from '@/utils/ajax';
import ProList from '@ant-design/pro-list';
import { Avatar, Card, Rate } from 'antd';
import moment from 'moment';
import { stringify } from 'qs';

export default ({ lawyer }: { lawyer: ILawyer }) => {
  return (
    <Card bordered>
      <ProList<ILawyerCase>
        itemLayout="vertical"
        rowKey="id"
        toolBarRender={false}
        split
        request={async (params = {}) => {
          const { current, pageSize, ...rest } = params;
          const newParams = {
            size: pageSize,
            page: current! - 1,
            ...rest,
            lawyerId: lawyer.id,
            status: ECaseStatus.Finished,
          };
          const { success, result } = (await ajax(
            `${OPEN_API_PREFIX}/user/lawyers/cases?${stringify(newParams)}`,
          )) as IAjaxResponseFactory<IPageFactory<ILawyerCase>>;
          if (!success) {
            return {
              data: [],
              success,
            };
          }

          return {
            data: result.content,
            success,
            page: result.number,
            total: result.totalElements,
          } as IRecommendResource<ILawyerCase[]>;
        }}
        pagination={{
          pageSize: 20,
        }}
        metas={{
          title: {
            render: (_, row) => {
              const userId = row.userId || '';
              const first = userId.charAt(0);
              const last = userId.charAt(userId.length - 1);
              return (
                <div>
                  {first}****{last}
                  <Rate
                    style={{ fontSize: 18, marginLeft: 20 }}
                    disabled
                    defaultValue={row.score || 0}
                  />
                </div>
              );
            },
          },
          avatar: {
            render: () => {
              return <Avatar />;
            },
          },
          description: {
            render: (_, row) => {
              return (
                <>
                  <div>{row.evaluate || '用户未做出评价'}</div>
                  <div style={{ marginTop: 10 }}>
                    {moment(row.createTime).format('YYYY-MM-DD HH:mm')}
                  </div>
                </>
              );
            },
          },
        }}
      />
    </Card>
  );
};
