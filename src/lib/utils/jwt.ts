export type JWTPayload = {
  sub: string
  email: string
  role: 'Employee' | 'Admin'
  exp: number
  iat: number
}

export function decodeJWT(token: string): JWTPayload | null {
  try {
    const base64Url = token.split('.')[1]

    if (!base64Url) {
      return null
    }

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    )

    return JSON.parse(jsonPayload) as JWTPayload
  } catch (error) {
    console.error('[decodeJWT] Failed to decode token:', error)
    return null
  }
}

export function isTokenExpired(payload: JWTPayload, bufferSeconds = 30): boolean {
  if (!payload.exp) {
    return false
  }

  const expiryTime = payload.exp * 1000
  const now = Date.now()
  const buffer = bufferSeconds * 1000

  return now >= expiryTime - buffer
}

export function isTokenValid(token: string | undefined, bufferSeconds = 30): boolean {
  if (!token) {
    return false
  }

  const payload = decodeJWT(token)
  if (!payload) {
    return false
  }

  return !isTokenExpired(payload, bufferSeconds)
}
