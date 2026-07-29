import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ignitron-medic-ui.pages.dev',
  output: 'static',
  trailingSlash: 'never',
  integrations: [react(), sitemap()],
  vite: {
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
  },
});
