// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';

const { REACT_APP_ENV } = process.env;

const publicPath = '/web-static/';

export default defineConfig({
  publicPath,
  hash: true,
  // history: { type: 'hash' },
  antd: {},
  // ssr: {},
  // exportStatic: {},
  dva: {
    hmr: true,
  },
  layout: false,
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  favicon: `${publicPath}favicon.ico`,
  metas: [
    {
      name: 'keywords',
      content:
        'keywords',
    },
    {
      name: 'description',
      content:
        'description',
    },
    { name: 'build-time', content: new Date().toISOString() },
  ],
  targets: {
    ie: 11,
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    jquery: 'jQuery',
    moment: 'moment',
    lodash: '_',
  },
  scripts: [
    { src: `${publicPath}libs/jquery-3.6.0.min.js` },
    { src: `${publicPath}libs/lodash-4.17.21.min.js` },
    { src: `${publicPath}libs/moment-2.29.1.min.js` },
    { src: `${publicPath}libs/react-17.0.2.production.min.js` },
    { src: `${publicPath}libs/react-dom-17.0.2.production.min.js` },
  ],
  chunks: ['vendors', 'umi'],
  chainWebpack: function (config, { webpack }) {
    config.merge({
      optimization: {
        splitChunks: {
          chunks: 'all',
          minSize: 30000,
          minChunks: 3,
          automaticNameDelimiter: '.',
          cacheGroups: {
            vendor: {
              name: 'vendors',
              test({ resource }: any) {
                return /[\\/]node_modules[\\/]/.test(resource);
              },
              priority: 10,
            },
          },
        },
      },
    });
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: 'title',
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
});
