import { PRODUCT_COPYRIGHT } from '@/appConfig';
import PageLayout from '@/layouts/PageLayout';
import { Col, Image, Row, Space } from 'antd';
import locationImage from './assets/location.png';
import styles from './index.less';

export default () => {
  return (
    <PageLayout>
      <Row>
        <Col xs={{ span: 24 }} md={{ span: 8 }}>
          <div className={styles.title}>
            <p>CONTACT</p>
            <p>US</p>
            <span>联系我们</span>
          </div>
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 16 }}>
          <div className={styles.box}>
            <ul>
              <li>{PRODUCT_COPYRIGHT}</li>
              <li>客服电话：123456789</li>
              <li>地址：地址地址地址地址地址地址地址地址地址地址地址地址地址地址地址</li>
              <li>
                <Image.PreviewGroup>
                  <Space size="large">
                    <Image height={340} src="xxx.png" />
                  </Space>
                </Image.PreviewGroup>
              </li>
            </ul>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <picture className={styles.location}>
            <img src={locationImage} />
          </picture>
        </Col>
      </Row>
    </PageLayout>
  );
};
