import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
    { path: '/', component: '@/pages/arc' },
    { path: '/arc', component: '@/pages/arc' },
  ],
  proxy: {
    "/baidu": {
      target: "http://api.map.baidu.com",
      changeOrigin: true,
      pathRewrite: { '^/baidu': '' },
    }
  },
});
