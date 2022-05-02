/**
 * 小策审查结果
 *
 * `[{"companyA": "11111111111111111", "companyB": "11111111111111111"}, {"第五条": ["合同变更、中止、终止与解除"], "第七条": ["违约责任项", "合同变更、中止、终止与解除"], "第八条": ["不可抗力项", "合同变更、中止、终止与解除"], "第九条": ["违约责任项", "合同变更、中止、终止与解除"], "第十条": ["合同变更、中止、终止与解除"], "第十一条": ["声明与保证项"], "第十二条": ["声明与保证项"], "第十三条": ["违约责任项"], "第十五条": ["违约责任项", "损害赔偿责任项"], "第十六条": ["免责情形项", "声明与保证项", "不可抗力项"], "第十八条": ["权利义务项"], "第十九条": ["争议解决项"]}, {"法律适用项": 0, "税费承担": 0, "保密义务项": 0, "履行义务期限项": 0, "履约保证金项": 0}]`
 *
 */
export type IDocAICheckResult = [
  Record<string, string>,
  /** 已有条款的风险 */
  Record<string, string[]>,
  /** 缺失条款 */
  Record<string, any>,
];

export interface IRisk {
  createId: string;
  createTime: string;
  id: number;
  level: string;
  name: string;
  recommend: string;
  tips: string;
  typeName: string;
  valid: '1' | '0';
}
export type TRiskMap = Record<string, IRisk>
