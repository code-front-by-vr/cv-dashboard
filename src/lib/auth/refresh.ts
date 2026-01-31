import 'server-only'

import { ClientError } from 'graphql-request'

import { updateTokenMutation } from '@/lib/graphql/mutations/auth'

import { clearAuthCookie, getRefreshToken, setAuthCookie } from './cookies.server'

export async function refreshToken(): Promise<string | null> {
  const refreshTokenValue = await getRefreshToken()

  if (!refreshTokenValue) return null

  try {
    const result = await updateTokenMutation()

    await setAuthCookie({
      accessToken: result.updateToken.access_token,
      refreshToken: result.updateToken.refresh_token,
    })

    return result.updateToken.access_token
  } catch (error) {
    if (error instanceof ClientError && error.response.status === 401) {
      await clearAuthCookie()
    }
    return null
  }
}
