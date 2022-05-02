import { PRODUCT_COPYRIGHT } from '@/appConfig';
import { DefaultFooter } from '@ant-design/pro-layout';

const dateYear = new Date().getFullYear();
export default () => {
  return <DefaultFooter copyright={`${dateYear} ${PRODUCT_COPYRIGHT}`} links={[]} />;
};
