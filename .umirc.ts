import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
    { path: '/', redirect: '/alarm' },
    { path: '/alarm', component: '@/pages/arc', title: '人防警报器一张图' },
    {
      path: '/evacuation',
      component: '@/pages/evacuation',
      title: '疏散基地能力分析',
    },
    // { path: '/proteam', component: '@/pages/proteam', title: '专业队能力分析' },
  ],
  proxy: {
    '/alarmsiteinfo': {
      target: 'http://172.24.129.11:18091/', //http://172.24.129.11:18091/ http://192.168.66.9:18095/
      changeOrigin: true,
    },
    '/evacuationBase': {
      target: 'http://192.168.66.14:18095/', //http://172.24.129.11:18091/ http://192.168.66.9:18095/
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
