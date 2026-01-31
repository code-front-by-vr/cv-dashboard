import { afterEach,beforeEach, describe, expect, it, vi } from 'vitest'

import type { JWTPayload } from '../jwt';
import { decodeJWT, isTokenExpired, isTokenValid } from '../jwt'

describe('JWT utils', () => {
  const NOW_MS = new Date('2026-01-01T12:00:00Z').getTime()
  const NOW_SECONDS = Math.floor(NOW_MS / 1000)

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(NOW_MS)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const createMockToken = (payload: Partial<JWTPayload>): string => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const body = btoa(JSON.stringify({
      sub: 'user123',
      email: 'test@example.com',
      role: 'Employee',
      exp: NOW_SECONDS + 3600,
      iat: NOW_SECONDS,
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
        exp: NOW_SECONDS + 3600,
        iat: NOW_SECONDS
      }
      expect(isTokenExpired(payload)).toBe(false)
    })

    it('should return true for expired token', () => {
      const payload: JWTPayload = {
        sub: 'user123',
        email: 'test@example.com',
        role: 'Employee',
        exp: NOW_SECONDS - 10,
        iat: NOW_SECONDS - 3600
      }
      expect(isTokenExpired(payload)).toBe(true)
    })

    it('should return false for token with no expiration date', () => {
      const payload: Omit<JWTPayload, 'exp'> = {
        sub: 'user123',
        email: 'test@example.com',
        role: 'Employee' as const,
        iat: NOW_SECONDS
      }
      expect(isTokenExpired(payload as JWTPayload)).toBe(false)
    })

    it('should true, if the token is expired by less than 20 seconds (buffer - 30 seconds)', () => {

      const payload: JWTPayload = {
        sub: 'user123',
        email: 'test@example.com',
        role: 'Employee',
        exp: NOW_SECONDS + 20,
        iat: NOW_SECONDS
      }
      expect(isTokenExpired(payload)).toBe(true)
    })
  })

  describe('isTokenValid', () => {
    it('should return true for valid token, non-expired token', () => {
      const token = createMockToken({ exp: NOW_SECONDS + 3600 })
      expect(isTokenValid(token)).toBe(true)
    })

    it('should return false for invalid token', () => {
      expect(isTokenValid('invalid.token')).toBe(false)
    })

    it('should return false for expired token', () => {
      const token = createMockToken({ exp: NOW_SECONDS - 100 })
      expect(isTokenValid(token)).toBe(false)
    })
  })
})