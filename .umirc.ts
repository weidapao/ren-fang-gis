import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
    { path: '/', redirect: '/alarm' },
    { path: '/alarm', component: '@/pages/arc', title:'布点测算' },
    { path: '/evacuation', component: '@/pages/evacuation', title:'疏散基地能力分析' },
    { path: '/proteam', component: '@/pages/proteam', title:'专业队能力分析' },
  ],
  proxy: {
    "/alarmsiteinfo": {
      target: "http://10.0.0.250:8989/mock/110",
      changeOrigin: true,
    }
  },
  history: {type: 'hash'},
  targets: {
    ie: 11,
  },
  theme: {
    'table-row-hover-bg':'none',
  }
});
