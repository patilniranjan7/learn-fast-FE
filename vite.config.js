import { defineConfig } from 'vite';
import { appConfig } from './src/shared/config/appConfig.js';

export default defineConfig({
  plugins: [
    {
      name: 'app-config-html',
      transformIndexHtml(html) {
        const companyName = appConfig.companyName
          .replaceAll('&', '&amp;')
          .replaceAll('<', '&lt;')
          .replaceAll('>', '&gt;')
          .replaceAll('"', '&quot;')
          .replaceAll("'", '&#39;');

        return html.replaceAll('%COMPANY_NAME%', () => companyName);
      },
    },
  ],
  esbuild: { jsx: 'automatic' },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (/node_modules\/(?:@mui|@emotion)\//.test(id)) return 'mui';
          if (id.includes('/node_modules/')) return 'vendor';
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
  },
});
