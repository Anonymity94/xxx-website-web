import { Request, Response } from 'express';

const getInfo = (req: Request, res: Response) => {
  res.json({
    id: '00000001',
    loginName: '登录名称',
    fullName: '律师名字1',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    telephone: '1823423243',
    status: '0',
    company: '公司公司公司公司公司公司',
    title: '头衔：高级合伙人',
    companyLocation: '北京海淀北京海淀北京海淀北京海淀北京海淀',
    goodAt: '交通事故,离婚纠纷',
    advantage: '有团队,高学历,处理迅速,主任律师',
    profile: '律师简介律师简介律师简介律师简介律师简介律师简介律师简介',
    orderStatus: '1',
    orderPrice: 20,
    archive:
      '<p>个人档案（富文本）个人档案（富文本）个人档案（富文本）个人档案（富文本）个人档案（富文本）个人档案（富文本）</p>',
    serviceScope:
      '<p>服务范围描述(富文本)服务范围描述(富文本)服务范围描述(富文本)服务范围描述(富文本)</p>',
    scoreAvg: 4,
    caseCount: 10,
    createTime: '2021-06-12 15:14:15',
  });
};

const getList = (req: Request, res: Response) => {
  res.json({
    number: 1,
    size: 20,
    totalPages: 4,
    totalElements: 6,
    content: [
      {
        id: '00000001',
        loginName: '登录名称',
        fullName: '律师名字1',
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        telephone: '1823423243',
        status: '0',
        company: '公司',
        companyLocation: '北京海淀',
        goodAt: '交通事故,离婚纠纷',
        advantage: '有团队,高学历,处理迅速,主任律师',
        profile: '律师简介律师简介律师简介律师简介律师简介律师简介律师简介',
        orderStatus: '0',
        orderPrice: 20,
        archive:
          '<p>个人档案（富文本）个人档案（富文本）个人档案（富文本）个人档案（富文本）个人档案（富文本）个人档案（富文本）</p>',
        serviceScope:
          '<p>服务范围描述(富文本)服务范围描述(富文本)服务范围描述(富文本)服务范围描述(富文本)</p>',
        scoreAvg: 4,
        caseCount: 10,
        createTime: '2021-06-12 15:14:15',
      },
      {
        id: '00000002',
        loginName: '登录名称',
        fullName: '律师名字1',
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        telephone: '1823423243',
        status: '0',
        company: '公司',
        companyLocation: '北京海淀',
        goodAt: '交通事故,离婚纠纷',
        advantage: '有团队,高学历,处理迅速,主任律师',
        profile: '律师简介律师简介律师简介律师简介律师简介律师简介律师简介',
        orderStatus: '1',
        orderPrice: 20,
        archive:
          '<p>个人档案（富文本）个人档案（富文本）个人档案（富文本）个人档案（富文本）个人档案（富文本）个人档案（富文本）</p>',
        serviceScope:
          '<p>服务范围描述(富文本)服务范围描述(富文本)服务范围描述(富文本)服务范围描述(富文本)</p>',
        scoreAvg: 4,
        caseCount: 10,
        createTime: '2021-06-12 15:14:15',
      },
    ],
  });
};

export default {
  'GET /api/open-api/v1/user/lawyers': getList,
  'GET /api/open-api/v1/user/lawyers/:id': getInfo,
};
