export enum ECaseStatus {
  'Running' = 'running',
  'Finished' = 'finished',
}
export interface ILawyerCase {
  id: string;
  lawyerId: string;
  lawyerFullName: string;
  userId: string;
  status: ECaseStatus;
  description: string;
  evaluate: string;
  score: number;
  createTime: string;
}
