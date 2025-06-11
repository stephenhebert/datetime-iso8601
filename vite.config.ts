import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    emptyOutDir: false,
    outDir: 'dist',
    lib: {
      entry: './src/index.ts',
      fileName: 'index',
      name: 'DateTimeIso8601',
      formats: [
        'es',
      ],
    },
  },
})
