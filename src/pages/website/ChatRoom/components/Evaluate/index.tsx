import type { IAjaxResponseFactory } from '@/data-typings';
import { evaluateLawyerWork } from '@/services';
import { ModalForm, ProFormRate, ProFormTextArea } from '@ant-design/pro-form';
import { message } from 'antd';
import React, { useImperativeHandle, useState } from 'react';
import { history } from 'umi';

interface IEvaluateProps {
  orderId: string;
}
export interface IEvaluateRefProps {
  openModal: () => void;
  closeModal: () => void;
}
const Evaluate = React.forwardRef(({ orderId }: IEvaluateProps, ref: any) => {
  const [visible, setVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const openModal = () => {
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
  };

  const afterModalClose = () => {
    closeModal();
    setSubmitting(false);
  };

  useImperativeHandle(ref, () => ({
    openModal,
    closeModal,
  }));

  return (
    <ModalForm<{
      score: number;
      evaluate: string;
    }>
      title="服务评价"
      visible={visible}
      modalProps={{
        closable: false,
        maskClosable: false,
        afterClose: afterModalClose,
      }}
      submitter={{
        resetButtonProps: {
          style: {
            display: 'none',
          },
        },
        submitButtonProps: {
          loading: submitting,
        },
      }}
      onFinish={async (values) => {
        setSubmitting(true);
        const { success }: IAjaxResponseFactory<any> = await evaluateLawyerWork({
          orderId,
          ...values,
          score: +values.score,
        });
        setSubmitting(false);
        if (success) {
          message.success('评价成功');
          // 关闭页面，进入首页
          history.replace('/');
          return true;
        }
        message.error('评价失败');
        return false;
      }}
    >
      <ProFormRate width="sm" name="score" label="评分" fieldProps={{ allowHalf: false }} />
      <ProFormTextArea name="evaluate" label="评价" />
    </ModalForm>
  );
});

export default Evaluate;
