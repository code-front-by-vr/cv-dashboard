import { graphql, HttpResponse } from 'msw'
import { describe, expect, it, vi } from 'vitest'

import { server } from '@/__tests__/mocks/server'

import { clearAuthCookie, getRefreshToken, setAuthCookie } from '../cookies.server'
import { refreshToken } from '../refresh'

vi.mock('../cookies.server')

const api = graphql.link(process.env.API_BASE_URL as string)

describe('refreshToken', () => {
  it('should refresh tokens successfully and save new tokens to cookies', async () => {
    vi.mocked(getRefreshToken).mockResolvedValue('existing_refresh_token')

    const result = await refreshToken()

    expect(result).toBe('refreshed_access_token')
    expect(setAuthCookie).toHaveBeenCalledWith({
      accessToken: 'refreshed_access_token',
      refreshToken: 'refreshed_refresh_token',
    })
  })

  it('should clear cookies and return null if refresh token is invalid', async () => {
    vi.mocked(getRefreshToken).mockResolvedValue('invalid_refresh_token')

    server.use(
      api.mutation('UpdateToken', () => {
        return new HttpResponse(null, {
          status: 401,
        })
      }),
    )

    const result = await refreshToken()

    expect(result).toBeNull()
    expect(setAuthCookie).not.toHaveBeenCalled()
    expect(clearAuthCookie).toHaveBeenCalled()
  })

  it('should return null if refresh token is not found', async () => {
    vi.mocked(getRefreshToken).mockResolvedValue(undefined)

    const result = await refreshToken()

    expect(result).toBeNull()
    expect(setAuthCookie).not.toHaveBeenCalled()
    expect(clearAuthCookie).not.toHaveBeenCalled()
  })

  it('should return null without clearing cookies if error is not 401', async () => {
    vi.mocked(getRefreshToken).mockResolvedValue('existing_refresh_token')

    server.use(
      api.mutation('UpdateToken', () => {
        return new HttpResponse(null, {
          status: 500,
        })
      }),
    )
    const result = await refreshToken()

    expect(result).toBeNull()
    expect(setAuthCookie).not.toHaveBeenCalled()
    expect(clearAuthCookie).not.toHaveBeenCalled()
  })
})
