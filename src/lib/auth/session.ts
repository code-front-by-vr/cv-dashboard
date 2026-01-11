import 'server-only'

import { redirect } from 'next/navigation'
import { cache } from 'react'

import type { SessionData } from '@/lib/types/auth'
import { decodeJWT, isTokenExpired } from '@/lib/utils/jwt'

import { getAccessToken } from './cookies.server'
import { refreshToken } from './refresh'

async function resolveSession(): Promise<SessionData | null> {
  const accessToken = await getAccessToken()
  let payload = accessToken ? decodeJWT(accessToken) : null

  if (!accessToken || !payload || isTokenExpired(payload)) {
    const newToken = await refreshToken()
    payload = newToken ? decodeJWT(newToken) : null
  }

  if (!accessToken || !payload) return null

  return {
    isAuth: true,
    userId: payload.sub,
    email: payload.email,
    role: payload.role,
  }
}
export const verifySession = cache(async () => {
  const session = await resolveSession()

  if (!session) redirect('/auth/login')

  return session
})

export const getSession = cache(resolveSession)
