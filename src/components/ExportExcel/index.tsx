import XLSX from 'xlsx';

/**
 * 数组导出excel
 * @data 数据
 * @name 表格名称
 */
const exportExcel = (data: any[], name: string) => {
  // 将数组转化为标签页
  const ws = XLSX.utils.aoa_to_sheet(data);
  // 创建工作薄
  const wb = XLSX.utils.book_new();
  // 将标签页插入到工作薄里
  XLSX.utils.book_append_sheet(wb, ws, 'sheet');
  // 将工作薄导出为excel文件
  XLSX.writeFile(wb, `${name}.xlsx`);
};

export { exportExcel };
