import { EUserRole } from '@/data-typings';
import { CustomerServiceOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import { useAccess } from 'umi';
import styles from './index.less';

const FixedWidget = () => {
  const access = useAccess();

  // 已经登录但不是用户，就不显示客服
  if (access.isLogin && !access.isUser && !access.isCompanyUser) {
    return null;
  }

  return (
    <div
      className={styles['chat-button']}
      onClick={() =>
        window.open(`/web/chat?receiverId=&receiverName=&receiverRole=${EUserRole.CUSTOMER_SERVICE}`)
      }
    >
      <Avatar size={64} icon={<CustomerServiceOutlined />} />
    </div>
  );
};

export default FixedWidget;
