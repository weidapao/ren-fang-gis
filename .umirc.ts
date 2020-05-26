import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
    { path: '/', redirect: '/alarm' },
    { path: '/alarm', component: '@/pages/arc', title: '人防警报器一张图' },
    {
      path: '/evacuation',
      component: '@/pages/evacuation',
      title: '人防疏散基地一张图',
    },
    {
      path: '/proteam',
      component: '@/pages/proteam',
      title: '人防专业队一张图',
    },
    {
      path: '/evacuationArea',
      component: '@/pages/evacuationArea',
      title: '人防疏散地域一张图',
    },
  ],
  proxy: {
    '/alarmsiteinfo': {
      target: 'http://172.24.129.11:18091/', //http://172.24.129.11:18091/ http://192.168.66.9:18095/
      changeOrigin: true,
    },
    '/evacuationBase': {
      target: 'http://172.24.129.11:18091/', //http://172.24.129.11:18091/ http://192.168.66.9:18095/
      changeOrigin: true,
    },
    '/proteam': {
      target: 'http://172.24.129.11:18091/', //http://172.24.129.11:18091/ http://192.168.66.9:18095/
      changeOrigin: true,
    },
    '/evacuationArea': {
      target: 'http://172.24.129.11:18091/', //http://172.24.129.11:18091/ http://192.168.66.9:18095/
      changeOrigin: true,
    },
    '/social': {
      target: 'http://172.23.79.11:8080/', //http://172.24.129.11:18091/ http://192.168.66.9:18095/
      changeOrigin: true,
    },
  },
  history: { type: 'hash' },
  targets: {
    ie: 11,
  },
  theme: {
    'table-row-hover-bg': 'none',
  },
});
