import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    clearMocks: true,
    setupFiles: ['./src/__tests__/setup.ts'],
    env: {
      API_BASE_URL: 'http://localhost:3001/api/graphql',
    },
    alias: {
      'server-only': path.resolve(__dirname, './src/__tests__/mocks/empty.ts'),
      '@': path.resolve(__dirname, './src'),
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/__tests__/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        '.next/**',
      ],
    },
  },
})
