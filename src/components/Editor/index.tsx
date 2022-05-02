import { useEffect, useRef, useState } from 'react';
import E from 'wangeditor';
import styles from './index.less';

let editor: E | null = null;

interface IEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  createCallback?: (editor: E) => void;
}
const Editor = ({ value = '', onChange, createCallback }: IEditorProps) => {
  const [editorContent, setEditorContent] = useState<string>('');
  const editorMenuRef = useRef<any>();
  const editorContentRef = useRef<any>();

  // memo缓存，修改其他状态时，不会重新渲染

  useEffect(() => {
    setEditorContent(value);
  }, []);

  useEffect(() => {
    if (onChange) {
      onChange(editorContent);
    }
  }, [editorContent]);

  useEffect(() => {
    (async () => {
      // const E2 = await EMemo;
      editor = new E(editorMenuRef.current, editorContentRef.current);
      editor.config.onchange = (newHtml: string) => {
        setEditorContent(newHtml);
      };
      editor.config.onchange = (newHtml: string) => {
        setEditorContent(newHtml);
      };

      editor.config.zIndex = 1;
      editor.config.menus = [
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'link', // 插入链接
        'list', // 列表
        'justify', // 对齐方式
        'quote', // 引用
        // 'emoticon', // 表情
        'image', // 插入图片
        'table', // 表格
        // 'video', // 插入视频
        // 'code', // 插入代码
        'undo', // 撤销
        'redo', // 重复
      ];
      editor.config.uploadImgShowBase64 = true;
      // @ts-ignore
      // editor.customConfig.customUploadImg = (files: any[], insert: any) => {
      //   // files 是 input 中选中的文件列表
      //   // insert 是获取图片 url 后，插入到编辑器的方法
      //   if (!files || !Array.isArray(files)) {
      //     return;
      //   }
      //   const file = files[0];
      //   // const formData = new FormData();
      //   // formData.append('file', file);
      //   // fetch('/empty-item/api/uploadImg', {
      //   //   method: 'POST',
      //   //   body: formData,
      //   // })
      //   //   .then((response) => response.json())
      //   //   .then((response) => console.log(insert(imgUrl + response.data.url)))
      //   //   .catch((error) => console.error('Error:', error));
      // };
      editor.create();
      if (createCallback) {
        createCallback(editor);
      }
      editor.txt.html(value);
    })();
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, []);

  return (
    <div className="text-area">
      <div
        ref={editorMenuRef}
        style={{ backgroundColor: '#f1f1f1', border: '1px solid #ccc' }}
        className={styles.editorElemMenu}
      ></div>
      <div
        style={{
          height: 500,
          border: '1px solid #ccc',
          borderTop: 'none',
        }}
        ref={editorContentRef}
        className={styles.editorElemBody}
      ></div>
    </div>
  );
};

export default Editor;
