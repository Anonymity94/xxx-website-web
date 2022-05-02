import { API_PREFIX } from '@/appConfig';
import Editor from '@/components/Editor';
import NoAuthPage from '@/pages/403';
import {
  queryTemplateCheck,
  queryTemplateType,
  templateDownload,
  templateUpload,
} from '@/services';
import type { UploadProps } from 'antd';
import { Button, Card, Collapse, message, Modal, Space, Upload } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAccess } from 'umi';
import type E from 'wangeditor';
import styles from './index.less';
import type { IDocAICheckResult, IRisk, TRiskMap } from './typings';

const { Panel } = Collapse;

const uploadFileLoadingKey = 'upload-file-key';

// 用户审查类型
const USER_TYPE_MAP = {
  甲: '甲方',
  乙: '乙方',
};

// 风险等级
const RISK_LEVEL_MAP = {
  A: '高等风险',
  B: '中等风险',
  C: '轻微风险',
};

export type TUserType = keyof typeof USER_TYPE_MAP;

export const parseObject = (str: string) => {
  let r = {};
  try {
    r = JSON.parse(str);
  } catch (error) {
    r = {};
  }
  return r;
};

const parseArray = (str: string) => {
  let r = [];
  try {
    r = JSON.parse(str);
  } catch (error) {
    r = [];
  }
  return r;
};

const AIExamine = () => {
  const access = useAccess();
  // 用户类型
  const [userType, setUserType] = useState<TUserType>();
  // 小策判断的合同类型
  const [docTypeList, setDocTypeList] = useState<string[]>([]);
  const [docType, setDocType] = useState<string>();
  const [checkResult, setCheckResult] = useState<IDocAICheckResult>([] as any);

  const [riskMap, setRiskMap] = useState<TRiskMap>({});

  const editorRef = useRef<E | null>(null);

  // 用户类型弹出框是否显示
  const [userTypeModalVisible, setUserTypeModalVisible] = useState(false);
  // 文档类型弹出框是否显示
  const [docTypeModalVisible, setDocTypeModalVisible] = useState(false);

  const showUserTypeModal = () => {
    setUserTypeModalVisible(true);
  };
  const hideUserTypeModal = () => {
    setUserTypeModalVisible(false);
  };

  const showDocTypeModal = () => {
    setDocTypeModalVisible(true);
  };
  const hideDocTypeModal = () => {
    setDocTypeModalVisible(false);
  };

  useEffect(() => {
    if (userType) {
      setCheckResult([] as any);
      setRiskMap({});

      const text = editorRef?.current?.txt.text() || '';
      queryTemplateCheck({
        bargainText: text,
        userType,
        type: docType,
      }).then(({ success, result }) => {
        const resultJson: {
          result: string;
          dict: IRisk[];
        } = JSON.parse(result);
        if (success) {
          const checkResultArr = parseArray(resultJson.result);
          setCheckResult(checkResultArr as IDocAICheckResult);

          const map: TRiskMap = {};
          if (Array.isArray(resultJson.dict)) {
            for (let i = 0; i < resultJson.dict.length; i += 1) {
              const row = resultJson.dict[i];
              map[row.name] = row;
            }
          }
          setRiskMap(map);
        }
      });
    }
  }, [userType, docType]);

  const handleEditorCreate = (editor: E) => {
    editorRef.current = editor;
  };

  const handleGetType = () => {
    const text = editorRef?.current?.txt.text() || '';
    if (!text) {
      message.warning('没有要审查的内容');
      return;
    }
    queryTemplateType({ bargainText: text }).then(({ success, result }) => {
      setDocTypeList([]);
      setDocType(undefined);

      const res = parseObject(result);
      // @ts-ignore
      const templateNameMap = parseObject(res.result);

      if (Object.prototype.toString.call(templateNameMap) === '[object Object]') {
        const keys = Object.keys(templateNameMap);
        if (success && keys.length > 0) {
          const nameList = keys.map((key) => templateNameMap[key]);
          setDocTypeList(nameList);
          showDocTypeModal();
        } else {
          message.warning('审查的内容可能不是一个合同');
        }
      } else {
        message.warning('服务器忙碌，请稍后再试');
      }
    });
  };

  const handleExamine = () => {
    const text = editorRef?.current?.txt.text() || '';
    if (!text) {
      message.warning('没有要审查的内容');
      return;
    }
    handleGetType();
    // setUserType(undefined);
    // showUserTypeModal();
  };

  const handleUpload: UploadProps['onChange'] = (info) => {
    // 上传文件
    const formData = new FormData();
    formData.append('file', info.file as any);

    message.loading({ content: '文件上传中...', duration: 0, key: uploadFileLoadingKey });
    templateUpload(formData).then(({ success, result }) => {
      // 删除
      message.destroy(uploadFileLoadingKey);
      if (!success) {
        message.warning('上传失败');
      }

      editorRef?.current?.txt.html(success ? result : '');
      if (success) {
        handleGetType();
      }
    });
  };

  // 已有条款风险
  const renderRisk = useCallback(() => {
    if (!checkResult || !checkResult[1]) {
      return null;
    }
    const clauseTitles = Object.keys(checkResult[1]);

    return clauseTitles.map((clause) => (
      <div key={clause}>
        <div style={{ textAlign: 'center' }}>{clause}</div>
        <Collapse accordion ghost expandIconPosition="right" className={styles.detailCollapse}>
          {checkResult[1][clause].map((risk) => (
            <Panel header={risk} key={`${clause}_${risk}`}>
              <p>
                <span className={styles.tipTitle}>小策提示：</span>
                {riskMap[risk]?.tips}
              </p>
            </Panel>
          ))}
        </Collapse>
      </div>
    ));
  }, [checkResult, riskMap]);

  // 缺失条款
  const renderMissClause = useCallback(() => {
    if (!checkResult || !checkResult[2]) {
      return null;
    }
    const missClauseTitles = Object.keys(checkResult[2]);

    return (
      <Collapse accordion ghost expandIconPosition="right" className={styles.detailCollapse}>
        {missClauseTitles.map((clause) => (
          <Panel
            header={clause}
            key={`miss_${clause}`}
            extra={
              <span className={styles[`level_${riskMap[clause]?.level}`]}>
                {RISK_LEVEL_MAP[riskMap[clause]?.level]}
              </span>
            }
          >
            <p>
              <span className={styles.tipTitle}>小策提示：</span>
              {riskMap[clause]?.tips}
            </p>
            <p>
              <span className={styles.tipTitle}>建议条款：</span>
              {riskMap[clause]?.recommend}
            </p>
          </Panel>
        ))}
      </Collapse>
    );
  }, [checkResult, riskMap]);

  if (!access.isLegalAffairs) {
    return <NoAuthPage />;
  }

  return (
    <div className={styles['ai-ce']}>
      <div className={styles['ai-ce-action']}>
        <Space>
          <Upload
            fileList={[]}
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleUpload}
          >
            <Button type="primary">上传合同</Button>
          </Upload>
          <Button type="primary" onClick={handleExamine}>
            小策审查
          </Button>
          <Button
            type="primary"
            onClick={async () => {
              if (editorRef.current) {
                const html = editorRef.current?.txt.html() || '';
                if (!html.trim()) {
                  message.warning('没有要下载的内容');
                  return;
                }
                let fullHtml =
                  '<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head><body>';
                fullHtml += html;
                fullHtml += '</body></html>';
                const { success, result } = await templateDownload(fullHtml as string);
                if (!success || !result) {
                  message.warning('下载失败');
                  return;
                }

                window.open(`${API_PREFIX}/check/download-file?file=${result}`);
              }
            }}
          >
            下载文档
          </Button>
        </Space>
      </div>
      <div className={styles['ai-ce-content']}>
        <div className={styles['ai-ce-left']}>
          <Editor createCallback={handleEditorCreate} />
        </div>
        <div className={styles['ai-ce-right']}>
          <div className={styles.examine}>
            <Card
              title="【 AI审查仅供参考 】"
              bordered
              bodyStyle={{ maxHeight: 460, overflow: 'auto' }}
              style={{ background: '#00bcd4bf' }}
            >
              <Collapse accordion expandIconPosition="right">
                <Panel header="合同已有条款" key="1">
                  {renderRisk()}
                </Panel>

                <Panel header="合同缺失条款" key="2">
                  {renderMissClause()}
                </Panel>
              </Collapse>
            </Card>
          </div>
        </div>
      </div>
      <Modal
        title="请选择审查立场"
        visible={userTypeModalVisible}
        onCancel={hideUserTypeModal}
        keyboard={false}
        maskClosable={false}
        footer={null}
        width={840}
      >
        <p className={styles.title}>请为小策审查提供一个审查立场</p>
        <div className={styles.typeWrap}>
          {Object.keys(USER_TYPE_MAP).map((userTypeItem) => (
            <div
              className={styles.typeItem}
              key={userTypeItem}
              onClick={() => {
                setUserType(userTypeItem as TUserType);
                hideUserTypeModal();
              }}
            >
              {USER_TYPE_MAP[userTypeItem]}
            </div>
          ))}
        </div>
      </Modal>
      <Modal
        title="请选择合适的合同类型"
        visible={docTypeModalVisible}
        onCancel={hideDocTypeModal}
        keyboard={false}
        maskClosable={false}
        footer={null}
        width={840}
      >
        <p className={styles.title}>小策已对合同做出智能分析，请您选择一个更合适的分类</p>
        <div className={styles.typeWrap}>
          {docTypeList.map((type) => (
            <div
              className={styles.typeItem}
              key={type}
              onClick={() => {
                setUserType(undefined);
                setDocType(type);

                hideDocTypeModal();
                showUserTypeModal();
              }}
            >
              {type}
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default AIExamine;
