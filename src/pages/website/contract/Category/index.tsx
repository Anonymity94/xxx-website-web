import type { IContractCategory, IContractSubCategory } from '@/data-typings';
import PageLayout from '@/layouts/PageLayout';
import type { ConnectState } from '@/models/connect';
import { Col, Row, Spin } from 'antd';
import React, { useCallback, useEffect, useMemo } from 'react';
import type { Dispatch } from 'umi';
import { connect, Link } from 'umi';
import { SPECIAL_CONTRACT_CATEGORY_ID } from '../Special';
import styles from './index.less';

interface IContractCategoryProps {
  dispatch: Dispatch;
  loading?: boolean;
  categoryList: IContractCategory[];
  subCategoryList: IContractSubCategory[];
}
const ContractCategory = ({
  dispatch,
  loading,
  categoryList = [],
  subCategoryList = [],
}: IContractCategoryProps) => {
  useEffect(() => {
    dispatch({
      type: 'contractModel/queryCategoryAndSubCategory',
    });
  }, [dispatch]);

  const findSubByCategoryId = useCallback(
    (categoryId: string) => {
      return subCategoryList.filter((sub) => String(sub.categoryId) === String(categoryId));
    },
    [subCategoryList],
  );

  const treeData = useMemo(() => {
    const result: IContractCategory[] = [];
    categoryList.forEach((cate) => {
      if (String(cate.id) !== String(SPECIAL_CONTRACT_CATEGORY_ID)) {
        const subList = findSubByCategoryId(String(cate.id));
        result.push({ ...cate, children: subList });
      }
    });

    return result;
  }, [categoryList, findSubByCategoryId]);

  return (
    <PageLayout>
      <Spin spinning={loading}>
        <Row gutter={10}>
          {treeData.map(({ id, name, children = [] }) => (
            <Col span={8} key={id}>
              <div className={styles.box}>
                <div className={styles.header}>
                  <span className={styles.name}>{name}</span>
                  <span className={styles.count}>({children.length})</span>
                </div>
                <div className={styles.content}>
                  <Row gutter={10}>
                    {children.map((item) => (
                      <Col span={12} key={item.id}>
                        <Link
                          to={`/web/contract/list?categoryId=${item.categoryId}&subcategoryId=${item.id}`}
                        >
                          {item.name}
                        </Link>
                      </Col>
                    ))}
                  </Row>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Spin>
    </PageLayout>
  );
};

export default connect(
  ({ loading, contractModel: { categoryList, subCategoryList } }: ConnectState) => ({
    loading: loading.effects['contractModel/queryCategoryAndSubCategory'],
    categoryList,
    subCategoryList,
  }),
)(ContractCategory);
