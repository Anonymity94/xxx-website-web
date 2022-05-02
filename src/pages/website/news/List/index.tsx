import IconText from '@/components/IconText';
import type { INews, IPageFactory, IRecommendResource, IAjaxResponseFactory } from '@/data-typings';
import { EBoolean, EStatus } from '@/data-typings';
import PageLayout from '@/layouts/PageLayout';
import ajax from '@/utils/ajax';
import { OPEN_API_PREFIX, UPLOAD_FILE_PATH_PREFIX } from '@/appConfig';
import { ClockCircleOutlined, EyeOutlined } from '@ant-design/icons';
import ProList from '@ant-design/pro-list';
import { Card, Carousel, Tag, Typography } from 'antd';
import moment from 'moment';
import { stringify } from 'querystring';
import React from 'react';
import { history } from 'umi';

import styles from './index.less';

export default () => {
  return (
    <PageLayout>
      <Card bordered>
        <ProList<INews>
          className={styles['news-list']}
          itemLayout="vertical"
          rowKey="id"
          toolBarRender={false}
          split
          request={async (params = {}) => {
            const { current, pageSize, ...rest } = params;
            const newParams = { size: pageSize, page: current! - 1, ...rest, status: EStatus.Open };
            const { success, result } = (await ajax(
              `${OPEN_API_PREFIX}/news?${stringify(newParams)}`,
            )) as IAjaxResponseFactory<IPageFactory<INews>>;
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
            } as IRecommendResource<INews[]>;
          }}
          pagination={{
            pageSize: 20,
          }}
          metas={{
            title: {
              render: (_, row) => {
                return (
                  <div className={styles['news-title']}>
                    <span
                      className={styles['news-title__text']}
                      onClick={() => history.push(`/web/news/${row.id}`)}
                    >
                      {row.title}{' '}
                    </span>
                    {row.isTop === EBoolean.True && (
                      <Tag color="blue" key="top">
                        置顶
                      </Tag>
                    )}
                  </div>
                );
              },
            },

            actions: {
              render: (_, row) => [
                <IconText
                  icon={EyeOutlined}
                  text={`${row.visitCount || 0}`}
                  key="news-visit-count"
                />,
                <IconText
                  icon={ClockCircleOutlined}
                  text={`${moment(row.createTime).format('YYYY-MM-DD HH:mm')}`}
                  key="news-create-time"
                />,
              ],
            },
            extra: {
              render: (_, row) => {
                if (!row.coverImgs) {
                  return null;
                }
                const imgsList = row.coverImgs.split(',');
                if (imgsList.length === 0) {
                  return null;
                }
                return (
                  <div className={styles['news-cover']}>
                    <Carousel autoplay={imgsList.length > 1}>
                      {imgsList.map((img) => (
                        <div className={styles['news-cover__item']} key={img}>
                          <div
                            style={{ backgroundImage: `url(${UPLOAD_FILE_PATH_PREFIX}${img})` }}
                          ></div>
                        </div>
                      ))}
                    </Carousel>
                  </div>
                );
              },
            },
            content: {
              render: (_, row) => {
                return (
                  <div style={{ height: 70 }}>
                    <Typography.Paragraph ellipsis={{ rows: 3 }} style={{ marginBottom: 0 }}>
                      {row.profile}
                    </Typography.Paragraph>
                  </div>
                );
              },
            },
          }}
        />
      </Card>
    </PageLayout>
  );
};
