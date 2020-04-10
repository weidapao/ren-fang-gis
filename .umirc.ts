import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
    { path: '/', redirect: '/arc' },
    { path: '/arc', component: '@/pages/arc', title:'警报查看' },
  ],
  proxy: {
    "/alarmsiteinfo": {
      target: "http://10.0.0.250:8989/mock/110",
      changeOrigin: true,
    }
  },
  history: {type: 'hash'},
});
