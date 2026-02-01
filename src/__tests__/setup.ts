import { afterAll, afterEach, beforeAll, vi } from 'vitest'

import { server } from './mocks/server'

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  vi.resetAllMocks()
})
afterAll(() => server.close())
