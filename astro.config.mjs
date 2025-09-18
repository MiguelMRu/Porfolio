// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  vite: {
    server: {
      watch: {
        usePolling: true,
        interval: 100, // puedes probar con 200 si sigue fallando
      },
    },
  },
  site: 'https://porfolio-jet-kappa.vercel.app/',
  integrations: [sitemap()],
});