// vite.config.js
import { defineConfig, loadEnv } from 'vite';


export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all envs regardless of the VITE_ prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL, // Accessed here securely
          changeOrigin: true,
        },
      },
    },
  };
});