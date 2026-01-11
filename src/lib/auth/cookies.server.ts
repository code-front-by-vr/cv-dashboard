import 'server-only'

import { cookies } from 'next/headers'

const ACCESS_TOKEN = 'access_token'
const REFRESH_TOKEN = 'refresh_token'

type AuthCookie = {
  accessToken: string
  refreshToken: string
}

export async function setAuthCookie({ accessToken, refreshToken }: AuthCookie) {
  const cookieStore = await cookies()
  const isProd = process.env.NODE_ENV === 'production'

  cookieStore.set(ACCESS_TOKEN, accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 15,
  })

  cookieStore.set(REFRESH_TOKEN, refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function getAccessToken() {
  const cookieStore = await cookies()

  return cookieStore.get(ACCESS_TOKEN)?.value
}

export async function getRefreshToken() {
  const cookieStore = await cookies()

  return cookieStore.get(REFRESH_TOKEN)?.value
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()

  cookieStore.delete(ACCESS_TOKEN)
  cookieStore.delete(REFRESH_TOKEN)
}
