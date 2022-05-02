import Banner from '@/components/Banner';
import { PageContainer } from '@ant-design/pro-layout';
import classNames from 'classnames';
import type { ReactNode } from 'react';
import styles from './index.less';

interface IPageLayoutProps {
  loading?: boolean;
  /** 是否显示header顶部的图片 */
  showBanner?: boolean;
  /** 指定header顶部图片地址 */
  bannerImg?: string;
  /** 自定义显示header顶部的内容 */
  headerRender?: () => React.ReactNode | false;

  /** 是否显示面包屑 */
  showBreadcrumb?: boolean;
  /** 是否禁用content的 margin */
  disableContentMargin?: boolean;
  children?: ReactNode | string;
}

const PageLayout = ({
  loading = false,
  bannerImg,
  children,
  showBanner = true,
  showBreadcrumb = true,
  disableContentMargin = false,
  headerRender,
}: IPageLayoutProps) => {
  return (
    <>
      {headerRender ? headerRender() : showBanner && <Banner img={bannerImg} />}
      <section className={styles['page-content']}>
        <PageContainer
          title={false}
          loading={loading}
          className={classNames({
            [styles['hide-breadcrumb']]: !showBreadcrumb,
            [styles['no-margin']]: disableContentMargin,
          })}
        >
          {children}
        </PageContainer>
      </section>
    </>
  );
};

export default PageLayout;
