export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/',
        redirect: '/web/index',
      },
      {
        path: '/system/login',
        name: 'system.login',
        hideInMenu: true,
        component: './system/admin/Login',
      },
      {
        path: '/web/chat',
        name: 'chat',
        hideInMenu: true,
        component: './website/ChatRoom',
      },
      {
        path: '/web',
        component: '../layouts/BasicLayout',
        routes: [
          {
            path: '/web',
            redirect: '/web/index',
          },
          {
            path: '/web/index',
            name: 'home',
            component: './website/Home',
          },
          {
            path: '/web/contract',
            name: 'contract',
            routes: [
              {
                path: '/web/contract',
                redirect: '/web/contract/category',
              },
              {
                path: '/web/contract/category',
                name: 'category',
                component: './website/contract/Category',
              },
              {
                path: '/web/contract/list',
                name: 'list',
                hideInMenu: true,
                component: './website/contract/List',
              },
              {
                path: '/web/contract/search',
                name: 'search',
                component: './website/contract/Search',
              },
              {
                path: '/web/contract/full-text-search',
                name: 'full-text-search',
                component: './website/contract/FullTextSearch',
                access: 'isLegalAffairs',
              },
              {
                path: '/web/contract/:id',
                name: 'detail',
                hideInMenu: true,
                component: './website/contract/Detail',
              },
              {
                component: './404',
              },
            ],
          },
          {
            path: '/web/special-contract',
            name: 'contract.special',
            routes: [
              {
                path: '/web/special-contract',
                redirect: '/web/special-contract/list',
              },
              {
                path: '/web/special-contract/list',
                name: 'list',
                hideInMenu: true,
                component: './website/contract/Special',
              },
              {
                path: '/web/special-contract/:id',
                name: 'detail',
                hideInMenu: true,
                component: './website/contract/Detail',
              },
            ],
          },
          {
            path: '/web/ai-ce',
            name: 'ai-ce',
            access: 'isLegalAffairs',
            component: './website/AI-ce',
          },
          {
            path: '/web/lawyer',
            name: 'lawyer',
            routes: [
              {
                path: '/web/lawyer',
                name: '',
                component: './website/lawyer/List',
              },
              {
                path: '/web/lawyer/:id',
                name: 'detail',
                hideInMenu: true,
                component: './website/lawyer/Detail',
              },
              {
                component: './404',
              },
            ],
          },
          {
            path: '/web/legal-affairs',
            name: 'legal-affairs',
            routes: [
              {
                path: '/web/legal-affairs',
                name: '',
                component: './website/LegalAffairs',
              },
              {
                component: './404',
              },
            ],
          },
          {
            path: '/web/news',
            name: 'news',
            routes: [
              {
                path: '/web/news',
                name: '',
                component: './website/news/List',
              },
              {
                path: '/web/news/:id',
                name: 'detail',
                hideInMenu: true,
                component: './website/news/Detail',
              },
              {
                component: './404',
              },
            ],
          },
          {
            path: '/web/contact',
            name: 'contact',
            component: './website/Contact',
          },
          {
            path: '/web/account/settings',
            name: 'account.settings',
            hideInMenu: true,
            component: './website/account/Settings',
          },
          {
            component: './404',
          },
        ],
      },
      {
        path: '/system',
        icon: 'crown',
        access: 'isAdmin',
        component: '../layouts/SystemLayout',
        routes: [
          {
            path: '/system',
            redirect: '/system/user/user',
          },
          {
            path: '/system/user/user',
            name: 'system.user.user',
            icon: 'smile',
            component: './system/user/List',
          },
          {
            path: '/system/user/lawyer',
            name: 'system.user.lawyer',
            icon: 'smile',
            routes: [
              {
                path: '/system/user/lawyer',
                redirect: '/system/user/lawyer/list',
              },
              {
                path: '/system/user/lawyer/list',
                name: 'list',
                component: './system/lawyer/List',
              },
              {
                path: '/system/user/lawyer/create',
                name: 'create',
                component: './system/lawyer/Create',
              },
              {
                path: '/system/user/lawyer/:id/update',
                name: 'update',
                hideInMenu: true,
                component: './system/lawyer/Update',
              },
              {
                component: './404',
              },
            ],
          },
          {
            path: '/system/user/customer-service',
            name: 'system.user.customer-service',
            icon: 'smile',
            routes: [
              {
                path: '/system/user/customer-service',
                redirect: '/system/user/customer-service/list',
              },
              {
                path: '/system/user/customer-service/list',
                name: 'list',
                component: './system/customer-service/List',
              },
              {
                path: '/system/user/customer-service/create',
                name: 'create',
                component: './system/customer-service/Create',
              },
              {
                path: '/system/user/customer-service/:id/update',
                name: 'update',
                hideInMenu: true,
                component: './system/customer-service/Update',
              },
              {
                component: './404',
              },
            ],
          },
          {
            path: '/system/user/legal-affairs',
            name: 'system.user.legal-affairs',
            icon: 'smile',
            routes: [
              {
                path: '/system/user/legal-affairs',
                redirect: '/system/user/legal-affairs/list',
              },
              {
                path: '/system/user/legal-affairs/list',
                name: 'list',
                component: './system/legal-affairs/List',
              },
              {
                path: '/system/user/legal-affairs/create',
                name: 'create',
                component: './system/legal-affairs/Create',
              },
              {
                path: '/system/user/legal-affairs/:id/update',
                name: 'update',
                hideInMenu: true,
                component: './system/legal-affairs/Update',
              },
              {
                path: '/system/user/legal-affairs/introduction',
                name: 'introduction',
                component: './system/legal-affairs/Introduction',
              },
              {
                component: './404',
              },
            ],
          },
          {
            path: '/system/legal-affairs/service',
            name: 'system.legal-affairs.service',
            icon: 'smile',
            routes: [
              {
                path: '/system/legal-affairs/service',
                redirect: '/system/legal-affairs/service/list',
              },
              {
                path: '/system/legal-affairs/service/list',
                name: 'list',
                component: './system/legal-affairs-service/List',
              },
              {
                path: '/system/legal-affairs/service/create',
                name: 'create',
                component: './system/legal-affairs-service/Create',
              },
              {
                path: '/system/legal-affairs/service/:id/update',
                name: 'update',
                hideInMenu: true,
                component: './system/legal-affairs-service/Update',
              },
              {
                component: './404',
              },
            ],
          },
          {
            path: '/system/user/company-user',
            name: 'system.user.company-user',
            icon: 'smile',
            routes: [
              {
                path: '/system/user/company-user',
                redirect: '/system/user/company-user/list',
              },
              {
                path: '/system/user/company-user/list',
                name: 'list',
                component: './system/company-user/List',
              },
              {
                path: '/system/user/company-user/create',
                name: 'create',
                component: './system/company-user/Create',
              },
              {
                path: '/system/user/company-user/:id/update',
                name: 'update',
                hideInMenu: true,
                component: './system/company-user/Update',
              },
              {
                component: './404',
              },
            ],
          },
          {
            path: '/system/user/admin',
            name: 'system.user.admin',
            icon: 'smile',
            routes: [
              {
                path: '/system/user/admin',
                redirect: '/system/user/admin/list',
              },
              {
                path: '/system/user/admin/list',
                name: 'list',
                component: './system/admin/List',
              },
              {
                path: '/system/user/admin/create',
                name: 'create',
                component: './system/admin/Create',
              },
              {
                path: '/system/user/admin/:id/update',
                name: 'update',
                hideInMenu: true,
                component: './system/admin/Update',
              },
              {
                component: './404',
              },
            ],
          },
          {
            path: '/system/contract',
            name: 'system.contract',
            icon: 'smile',
            routes: [
              {
                path: '/system/contract/category',
                name: 'category',
                icon: 'smile',
                routes: [
                  {
                    path: '/system/contract/category',
                    redirect: '/system/contract/category/list',
                  },
                  {
                    path: '/system/contract/category/list',
                    name: 'list',
                    component: './system/contract/Category/List',
                  },
                  {
                    path: '/system/contract/category/create',
                    name: 'create',
                    component: './system/contract/Category/Create',
                  },
                  {
                    path: '/system/contract/category/:id/update',
                    name: 'update',
                    hideInMenu: true,
                    component: './system/contract/Category/Update',
                  },
                  {
                    component: './404',
                  },
                ],
              },
              {
                path: '/system/contract/sub-category',
                name: 'sub-category',
                icon: 'smile',
                routes: [
                  {
                    path: '/system/contract/sub-category',
                    redirect: '/system/contract/sub-category/list',
                  },
                  {
                    path: '/system/contract/sub-category/list',
                    name: 'list',
                    component: './system/contract/SubCategory/List',
                  },
                  {
                    path: '/system/contract/sub-category/create',
                    name: 'create',
                    component: './system/contract/SubCategory/Create',
                  },
                  {
                    path: '/system/contract/sub-category/:id/update',
                    name: 'update',
                    hideInMenu: true,
                    component: './system/contract/SubCategory/Update',
                  },
                  {
                    component: './404',
                  },
                ],
              },
              {
                path: '/system/contract/contract',
                name: 'contract',
                icon: 'smile',
                routes: [
                  {
                    path: '/system/contract/contract',
                    redirect: '/system/contract/contract/list',
                  },
                  {
                    path: '/system/contract/contract/list',
                    name: 'list',
                    component: './system/contract/Contract/List',
                  },
                  {
                    path: '/system/contract/contract/create',
                    name: 'create',
                    component: './system/contract/Contract/Create',
                  },
                  {
                    path: '/system/contract/contract/:id/update',
                    name: 'update',
                    hideInMenu: true,
                    component: './system/contract/Contract/Update',
                  },
                  {
                    component: './404',
                  },
                ],
              },
            ],
          },
          {
            path: '/system/news',
            name: 'system.news',
            icon: 'smile',
            routes: [
              {
                path: '/system/news',
                redirect: '/system/news/list',
              },
              {
                path: '/system/news/list',
                name: 'list',
                component: './system/News/List',
              },
              {
                path: '/system/news/create',
                name: 'create',
                component: './system/News/Create',
              },
              {
                path: '/system/news/:id/update',
                name: 'update',
                hideInMenu: true,
                component: './system/News/Update',
              },
              {
                component: './404',
              },
            ],
          },
          {
            path: '/system/financial',
            name: 'system.financial',
            icon: 'smile',
            routes: [
              {
                path: '/system/financial/lawyer',
                name: 'lawyer',
                icon: 'smile',
                hideChildrenInMenu: true,
                routes: [
                  {
                    path: '/system/financial/lawyer',
                    redirect: '/system/financial/lawyer/list',
                  },
                  {
                    path: '/system/financial/lawyer/list',
                    name: 'list',
                    component: './system/financial/Lawyer/List',
                  },
                  {
                    path: '/system/financial/lawyer/detail',
                    name: 'detail',
                    component: './system/financial/Lawyer/Detail',
                  },
                  {
                    component: './404',
                  },
                ],
              },
              {
                path: '/system/financial/contract',
                name: 'contract',
                component: './system/financial/Contract',
              },
              {
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },

  {
    component: './404',
  },
];
