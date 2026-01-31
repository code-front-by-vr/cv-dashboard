import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    clearMocks: true,
    globals: true,
    alias: {
      'server-only': path.resolve(__dirname, './src/__tests__/mocks/empty.ts'),
      '@': path.resolve(__dirname, './src'),
    },
  },
})