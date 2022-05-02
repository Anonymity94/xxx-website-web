import { CHAT_FILE_PATH_PREFIX } from '@/appConfig';
import { SoundOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Image } from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import type { IMessage } from '../../typings';
import { SYSTEM_ID } from '../../typings';
import styles from './index.less';

const timeFormatText = '【MM/DD HH:mm:ss】';

interface IMessageProps {
  message: IMessage;
  isMy?: boolean;
}
const Message = ({ message, isMy = false }: IMessageProps) => {
  return (
    <div
      className={classNames({
        [styles['message-wrap']]: true,
        [styles.my]: message.isMy || isMy,
      })}
    >
      {message.senderId === SYSTEM_ID ? (
        <div className={styles['message-alert']}>
          <p>{moment(message.timestamp).format(timeFormatText)}</p>
          <SoundOutlined />
          系统消息: {message.text}
        </div>
      ) : (
        <>
          <div className={styles['message-user-name']}>
            {message.senderName}
            <span>{moment(message.timestamp).format(timeFormatText)}</span>
          </div>

          <div className={styles['message-info']}>
            <div className={styles['message-info-avatar']}>
              <Avatar
                style={{ backgroundColor: message.isMy || isMy ? '#87d068' : '#fde3cf' }}
                icon={<UserOutlined />}
              />
            </div>
            <div className={styles['message-info-content']}>
              <div className={styles['message-info-content-message']}>
                {message.image && <Image width={300} src={message.image} />}
                {message.text && <span>{message.text}</span>}
                {message.file && (
                  <>
                    <Button
                      type="link"
                      onClick={() => window.open(`${CHAT_FILE_PATH_PREFIX}${message.file}`)}
                    >
                      {message.file}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default Message;
