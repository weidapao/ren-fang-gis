import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
    { path: '/', component: '@/pages/index' },
  ],
  proxy: {
    "/baidu": {
      target: "http://api.map.baidu.com",
      changeOrigin: true,
      pathRewrite: { '^/baidu': '' },
    }
  },
});
