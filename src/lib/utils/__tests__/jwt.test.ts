import { describe, expect, it } from 'vitest'

import type { JWTPayload } from '../jwt';
import { decodeJWT, isTokenExpired, isTokenValid } from '../jwt'

describe('JWT utils', () => {
  const createMockToken = (payload: Partial<JWTPayload>): string => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const body = btoa(JSON.stringify({
      sub: 'user123',
      email: 'test@example.com',
      role: 'Employee',
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000),
      ...payload
    }))
    return `${header}.${body}.signature`
  }

  describe('decode JWT', () => {
    it('should decode a valid JWT token', () => {
      const token = createMockToken({ sub: 'user123' })
      const payload = decodeJWT(token)

      expect(payload).toBeTruthy()
      expect(payload?.sub).toBe('user123')
      expect(payload?.email).toBe('test@example.com')
    })

    it('should return null, if the token is invalid', () => {
      expect(decodeJWT('invalid.token')).toBeNull()
      expect(decodeJWT('')).toBeNull()
    })
  })

  describe('isTokenExpired', () => {
    it('should return false for valid token', () => {
      const payload: JWTPayload = {
        sub: 'user123',
        email: 'test@example.com',
        role: 'Employee',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000)
      }
      expect(isTokenExpired(payload)).toBe(false)
    })

    it('should return true for expired token', () => {
      const payload: JWTPayload = {
        sub: 'user123',
        email: 'test@example.com',
        role: 'Employee',
        exp: Math.floor(Date.now() / 1000) - 3600,
        iat: Math.floor(Date.now() / 1000)
      }
      expect(isTokenExpired(payload)).toBe(true)
    })

    it('should return false for token with no expiration date', () => {
      const payload: Omit<JWTPayload, 'exp'> = {
        sub: 'user123',
        email: 'test@example.com',
        role: 'Employee' as const,
        iat: Math.floor(Date.now() / 1000)
      }
      expect(isTokenExpired(payload as JWTPayload)).toBe(false)
    })

    it('should respect the buffer seconds', () => {
      const payload: JWTPayload = {
        sub: 'user123',
        email: 'test@example.com',
        role: 'Employee',
        exp: Math.floor(Date.now() / 1000) + 20,
        iat: Math.floor(Date.now() / 1000)
      }
      expect(isTokenExpired(payload)).toBe(true)
    })
  })

  describe('isTokenValid', () => {
    it('should return true for valid token', () => {
      const token = createMockToken({ sub: 'user123' })
      expect(isTokenValid(token)).toBe(true)
    })

    it('should return false for invalid token', () => {
      expect(isTokenValid('invalid.token')).toBe(false)
    })

    it('should return false for expired token', () => {
      const payload: JWTPayload = {
        sub: 'user123',
        email: 'test@example.com',
        role: 'Employee',
        exp: Math.floor(Date.now() / 1000) - 7200,
        iat: Math.floor(Date.now() / 1000)
      }
      const token = createMockToken(payload)
      expect(isTokenValid(token)).toBe(false)
    })
  })
})