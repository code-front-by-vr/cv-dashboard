import { graphql, HttpResponse } from 'msw'
import { describe, expect, it, vi } from 'vitest'

import { server } from '@/__tests__/mocks/server'

import { graphQlRequest } from '../client'

vi.mock('@/lib/auth/cookies.server')
vi.mock('@/lib/auth/refresh')

import { getAccessToken } from '@/lib/auth/cookies.server'
import { refreshToken } from '@/lib/auth/refresh'

const api = graphql.link(process.env.API_BASE_URL as string)

describe('graphQlRequest', () => {
  it('should return Authorization header when token is present', async () => {
    vi.mocked(getAccessToken).mockResolvedValue('mock-token')

    let capturedToken = null
    server.use(
      api.query('GetData', async ({ request }) => {
        capturedToken = request.headers.get('Authorization')

        return HttpResponse.json({
          data: {
            result: 'success',
          },
        })
      }),
    )
    await graphQlRequest('query GetData {result}')

    expect(capturedToken).toBe('Bearer mock-token')
  })

  it('should retry request when first attempt fails with 401 and refresh is successful', async () => {
    vi.mocked(getAccessToken).mockResolvedValue('expired-token')
    vi.mocked(refreshToken).mockResolvedValue('new-token')

    let attemptCount = 0
    server.use(
      api.query('GetData', ({ request }) => {
        const authHeader = request.headers.get('Authorization')

        attemptCount++

        if (attemptCount === 1) {
          return new HttpResponse(null, { status: 401 })
        }

        if (authHeader === 'new-token') {
          return HttpResponse.json({
            data: {
              result: 'success',
            },
          })
        }

        return HttpResponse.json({ data: { result: 'retry-success' } })
      }),
    )
    const result = await graphQlRequest('query GetData {result}')

    expect(attemptCount).toBe(2)
    expect(refreshToken).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ result: 'retry-success' })
  })

  it('should throw error if refresh token fails', async () => {
    vi.mocked(getAccessToken).mockResolvedValue('bad-token')
    vi.mocked(refreshToken).mockResolvedValue(null)

    server.use(
      api.query('GetData', () => {
        return HttpResponse.json(
          {
            errors: [{ message: 'Unauthorized' }],
          },
          { status: 401 },
        )
      }),
    )

    await expect(graphQlRequest('query GetData {result}')).rejects.toThrow()
    expect(refreshToken).toHaveBeenCalled()
  })

  it('should throw error if request fails with non-401 status', async () => {
    vi.mocked(getAccessToken).mockResolvedValue('mock-token')

    server.use(
      api.query('GetData', () => {
        return new HttpResponse(null, { status: 500 })
      }),
    )

    await expect(graphQlRequest('query GetData {result}')).rejects.toThrow()
  })
})
