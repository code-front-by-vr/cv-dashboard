import { describe, expect, it, vi } from 'vitest'

import { setAuthCookie } from '../cookies.server'
import { getRefreshToken } from '../cookies.server'
import { refreshToken } from '../refresh'

vi.mock('../cookies.server', () => ({
  getRefreshToken: vi.fn(),
  setAuthCookie: vi.fn(),
  clearAuthCookie: vi.fn(),
}))

describe('refreshToken', () => {
  it('should refresh tokens successfully and save new tokens to cookies', async () => {
    vi.mocked(getRefreshToken).mockResolvedValue('existing_refresh_token')

    const result = await refreshToken()

    expect(result).toBe('refreshed_access_token')
    expect(setAuthCookie).toHaveBeenCalledWith({
      accessToken: 'refreshed_access_token',
      refreshToken: 'refreshed_refresh_token'
    })
  })
})