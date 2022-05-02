import { Col, Row } from 'antd';
import Footer from '../Footer';
import styles from './index.less';

const WebsiteFooter = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles['footer-wrap']}>
        <Row>
          <Col md={6} sm={24} xs={24}>
            <div className={styles.column}>
              <h2>快速导航</h2>
              <div>
                <a>网站首页</a>
              </div>
              <div>
                <a>联系我们</a>
              </div>
              <div>
                <a>市场合作</a>
              </div>
            </div>
          </Col>
          <Col md={6} sm={24} xs={24}>
            <div className={styles.column}>
              <h2>律师服务</h2>
              <div>
                <a>律师加盟</a>
              </div>
              <div>
                <a>帐号注册</a>
              </div>
            </div>
          </Col>
          <Col md={6} sm={24} xs={24}>
            <div className={styles.column}>
              <h2>常见问题</h2>
              <div>
                <a>帐号帮助</a>
              </div>
              <div>
                <a>我是公众</a>
              </div>
            </div>
          </Col>
          <Col md={6} sm={24} xs={24}>
            <div className={styles.column}>
              <h2>热线电话</h2>
              <div className={styles.bold}>
                <a>123-4567890</a>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <Footer />
    </footer>
  );
};

export default WebsiteFooter;
