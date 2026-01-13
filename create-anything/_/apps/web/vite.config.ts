import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [reactRouter()],
  server: {
    allowedHosts: true,
    host: '0.0.0.0',
    port: 4000,
  },
});
