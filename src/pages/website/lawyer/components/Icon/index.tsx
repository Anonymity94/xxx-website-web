import styles from './index.less';

import qualificationIcon from './assets/qualification.svg';
import realNameIcon from './assets/real-name.svg';

interface IIconProps {
  type: 'qualification' | 'real-name';
}

const Icon = ({ type }: IIconProps) => {
  if (type === 'qualification') {
    return (
      <>
        <span
          key={type}
          className={styles.icon}
          style={{ backgroundImage: `url(${qualificationIcon})` }}
        ></span>
        平台认证
      </>
    );
  }
  if (type === 'real-name') {
    return (
      <>
        <span
          key={type}
          className={styles.icon}
          style={{ backgroundImage: `url(${realNameIcon})` }}
        ></span>
        实名认证
      </>
    );
  }
  return null;
};

export default Icon;
