import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
    { path: '/', redirect: '/arc' },
    { path: '/arc', component: '@/pages/arc', title:'警报查看' },
  ],
  proxy: {
    "/baidu": {
      target: "http://api.map.baidu.com",
      changeOrigin: true,
      pathRewrite: { '^/baidu': '' },
    }
  },
});
