# **仅用于学习交流，请勿传播！！！**

# xxx-website-web

某官网前台部分

## 前端开发环境

```
- Nodejs
- React
- TypeScript
```

## 后端开发环境

```
- JDK11
- Spring Boot
- JPA
- MySQL
```

## 启动

```bash
yarn

yarn dev
```

## 服务器部署路径

```bash

cd /opt

# web打包后的 js 文件
mkdir -p /opt/website-apps/web/static/web-static
# web的 index.html
mkdir -p /opt/website-apps/web/static/template

# log
mkdir -p /opt/website-apps/log
# 存放数据的目录
mkdir -p /opt/website-apps/data

# 上传的公开文件，例如：用户的头像，合同 pdf 的截图
mkdir -p /opt/website-apps/resources/web-static/upload
# 在线咨询中上传的文件
mkdir -p /opt/website-apps/resources/web-static/upload/chatfile
# 上传的非公开文件，例如：合同的 pdf 文件
mkdir -p /opt/website-apps/resources/static
# spring boot *.properties 配置文件
mkdir -p /opt/website-apps/config
```

```
.
└── opt
    └── website-apps
        ├── config                    # 配置文件
        │   └── application.properties
        ├── log                       # log日志
        │   └── xxx-website-log.txt
        ├── resources                 # 资源
        │   └── web-static/upload     # 放置上传后的公开文件（头像、合同截图等）
        │   └── static                # 放置上传后的私有文件（合同pdf）
        ├── web                       # web页面
        │   └── static
        │       ├── template          # spring boot index.html入口
        │       │   └── index.html
        │       └── web-static        # web页面打包后的js文件
        │           ├── a.js
        │           └── b.js
        └── xxx-website.jar        # jar 包
        ├── pdf-bak                   # 初始化好的合同文件和合同截图备份
        │   ├── image.tar.gz
        │   └── temeplate.tar.gz
        ├── shutdown.sh               # 停止脚本
        ├── springboot.pid            
        ├── startup.sh                # 启动脚本
```
