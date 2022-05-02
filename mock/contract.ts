export default {
  'GET /api/open-api/v1/contract/categories': [
    {
      id: '1',
      name: '房地产合同',
    },
    {
      id: '2',
      name: '经营合同',
    },
    {
      id: '3',
      name: '金融合同',
    },
    {
      id: '4',
      name: '测试合同',
    },
    {
      id: '5',
      name: '测试合同222',
    },
    {
      id: '6',
      name: '测试合同333',
    },
  ],
  'GET /api/open-api/v1/contract/sub-categories': [
    {
      id: '11',
      categoryId: '1',
      categoryName: '房地产合同',
      name: '土地征用合同',
    },
    {
      id: '12',
      categoryId: '1',
      categoryName: '房地产合同',
      name: '房屋拆迁合同',
    },
    {
      id: '13',
      categoryId: '1',
      categoryName: '房地产合同',
      name: '工程合同',
    },
    {
      id: '14',
      categoryId: '1',
      categoryName: '房地产合同',
      name: '工程合同222',
    },
    {
      id: '15',
      categoryId: '1',
      categoryName: '房地产合同',
      name: '工程合同333',
    },
    {
      id: '21',
      categoryId: '2',
      categoryName: '经营合同',
      name: '兼并合同',
    },
    {
      id: '22',
      categoryId: '2',
      categoryName: '经营合同',
      name: '加盟合同',
    },
  ],

  'GET /api/open-api/v1/contract/contracts': {
    number: 1,
    size: 20,
    totalPages: 4,
    totalElements: 6,
    content: [
      {
        id: '21',
        name: '城镇房屋拆迁安置合同',
        categoryId: '2',
        categoryName: '经营合同',
        subcategoryId: '15',
        subcategoryName: '工程合同333',
        profile: '合同简介合同简介合同简介合同简介合同简介合同简介',
        status: '0',
        isHot: '0',
        downloadCount: 10,
        visitCount: 20,
      },
      {
        id: '22',
        name: '城镇房屋拆迁安置合同',
        categoryId: '2',
        categoryName: '经营合同',
        subcategoryId: '15',
        subcategoryName: '工程合同333',
        profile: '合同简介合同简介合同简介合同简介合同简介合同简介',
        status: '0',
        isHot: '0',
        downloadCount: 10,
        visitCount: 20,
      },
    ],
  },

  'GET /api/open-api/v1/contract/contracts/:id': {
    id: '21',
    name: '城镇房屋拆迁安置合同',
    categoryId: '2',
    categoryName: '经营合同',
    subcategoryId: '15',
    subcategoryName: '工程合同333',
    profile: '合同简介合同简介合同简介合同简介合同简介合同简介',
    status: '0',
    isHot: '0',
    price: 200,
    filePreviewImg: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    source: '来源来源来源来源来源来源来源来源来源来源',
    visitCount: 20,
    downloadCount: 10,
  },

  // 订单二维码
  'GET /api/open-api/v1/contract/contracts/:id/pay-qrcode': {
    qrcode: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    price: 200,
    // 订单ID
    orderId: '232323233',
  },
  // 订单状态
  'GET /api/open-api/v1/contract/contracts/:id/orders/:orderId/status': {
    status: 0, // 0 未支付 1 已支付 2已下载（这个用不到）
  },
  // 下载
  // 如果正常，就状态码 200直接文件流
  // 如果失败，就返回 403，抛个失败的错误？
  'GET /api/open-api/v1/contract/contracts/:id/orders/:orderId/download': {
    // 文件流
  },
};
