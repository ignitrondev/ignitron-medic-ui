import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src'],
      exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/test/**'],
      insertTypesEntry: true,
      tsconfigPath: './tsconfig.json',
    }),
  ],
  build: {
    lib: {
      entry: {
        index: 'src/index.ts',
        core: 'src/core/index.ts',
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
      cssFileName: 'odontogram',
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime'],
      output: {
        banner: (chunk) => chunk.name === 'index' ? "'use client';" : '',
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
});
