import styles from './index.less';
import defaultImg from './assets/banner.png';

interface IBannerProps {
  /** 高度 */
  height?: number;
  /** 背景图片 */
  img?: string;
}
// const defaultImg = 'https://gw.alipayobjects.com/zos/rmsportal/eVzxhywWMXULoUculczM.png';
// https://gw.alipayobjects.com/zos/rmsportal/MlWOvzoWNagIFfylgkim.png
const Banner = ({ height = 240, img = defaultImg }: IBannerProps) => {
  return <div className={styles.banner} style={{ height, backgroundImage: `url(${img})` }}></div>;
};

export default Banner;
