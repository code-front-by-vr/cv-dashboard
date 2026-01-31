import { graphql, HttpResponse } from 'msw'
import { describe, expect,it, vi } from 'vitest'

import { server } from '@/__tests__/mocks/server'
import { graphQlRequest } from '@/lib/graphql/client'

import { getAccessToken, getRefreshToken, setAuthCookie } from '../cookies.server'

vi.mock('../cookies.server')

const api = graphql.link(process.env.API_BASE_URL!)

describe('graphql client integration (silent refresh)', () => {
  it('should refresh tokens successfully using graphql-request', async () => {
    vi.mocked(getAccessToken).mockResolvedValue('expired_access_token')
    vi.mocked(getRefreshToken).mockResolvedValue('valid_refresh_token')

    let requestCount = 0
    server.use(api.query('GetData', ({ request }) => {
      requestCount++
      const authHeader = request.headers.get('Authorization')

      if (authHeader === 'Bearer expired_access_token') {
        return new HttpResponse(null, { status: 401 })
      }

      if (authHeader === 'Bearer refreshed_access_token') {
        return HttpResponse.json({
          data: {
            result: 'success'
          }
        })
      }

      return new HttpResponse(null, { status: 403 })
    }))

    const data = await graphQlRequest<{ result: string }>(`query GetData {result}`)

    expect(data).toEqual({ result: 'success' })
    expect(requestCount).toBe(2)
    expect(setAuthCookie).toHaveBeenCalledWith({
      accessToken: 'refreshed_access_token',
      refreshToken: 'refreshed_refresh_token'
    })
  })
})