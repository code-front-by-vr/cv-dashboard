import { graphql, HttpResponse } from 'msw'
import { describe, expect, it, vi } from 'vitest'

import { server } from '@/__tests__/mocks/server'

vi.mock('@/lib/auth/cookies.server')
vi.mock('next/navigation', () => {
  return {
    redirect: vi.fn()
  }
})

import { redirect } from 'next/navigation'

import { clearAuthCookie, setAuthCookie } from '@/lib/auth/cookies.server'

import { login, logout, signup } from '../auth'

describe('Auth actions', () => {
  describe('signup', () => {
    it('should successfully sign up user with valid data', async () => {
      const mockFormData = new FormData()
      mockFormData.set('email', 'test@example.com')
      mockFormData.set('password', 'password123')

      const result = await signup({ status: undefined }, mockFormData)

      expect(result?.status).toBe('success')
      expect(result?.message).toBe('Registration successful')
      expect(setAuthCookie).toHaveBeenCalledWith({
        accessToken: 'mock_access_token',
        refreshToken: 'mock_refresh_token'
      })

    })

    it('should handle signup mutation errors', async () => {
      server.use(graphql.link(process.env.API_BASE_URL!).mutation('Signup', () => {
        return HttpResponse.json({
          errors: [{ message: 'User already exists' }]
        })
      }))
      const mockFormData = new FormData()
      mockFormData.set('email', 'test@example.com')
      mockFormData.set('password', 'password123')

      const result = await signup({ status: undefined }, mockFormData)

      expect(result?.status).toBe('error')
      expect(result?.errors?._form).toBeDefined()
      expect(setAuthCookie).not.toHaveBeenCalled()
    })

    it('should return validation error for invalid email in signup', async () => {
      const mockFormData = new FormData()
      mockFormData.set('email', 'invalid-email')
      mockFormData.set('password', 'password123')

      const result = await signup({ status: undefined }, mockFormData)

      expect(result?.status).toBe('error')
      expect(result?.errors?.email).toBeDefined()
    })
  })

  describe('login', () => {
    it('should successfully login user with valid data', async () => {
      const mockFormData = new FormData()
      mockFormData.set('email', 'test@example.com')
      mockFormData.set('password', 'password123')

      const result = await login({ status: undefined }, mockFormData)

      expect(result?.status).toBe('success')
      expect(result?.message).toBeDefined()

      expect(setAuthCookie).toHaveBeenCalledWith({
        accessToken: 'mock_access_token',
        refreshToken: 'mock_refresh_token'
      })
    })

    it('should handle login query errors', async () => {
      server.use(
        graphql.link(process.env.API_BASE_URL!).query('Login', () => {
          return HttpResponse.json({
            errors: [{ message: 'Invalid Credentials' }]
          })
        })
      )
      const mockFormData = new FormData()
      mockFormData.set('email', 'test@example.com')
      mockFormData.set('password', 'wrong-password')

      const result = await login({ status: undefined }, mockFormData)

      expect(result?.status).toBe('error')
      expect(result?.errors?._form).toBeDefined()
      expect(setAuthCookie).not.toHaveBeenCalled()
    })

    it('should return validation error for invalid email in login', async () => {
      const mockFormData = new FormData()
      mockFormData.set('email', 'invalid-email')
      mockFormData.set('password', 'password123')

      const result = await login({ status: undefined }, mockFormData)

      expect(result?.status).toBe('error')
      expect(result?.errors?.email).toBeDefined()
    })
  })

  describe('logout', () => {
    it('should successfully logout user', async () => {
      await logout()

      expect(clearAuthCookie).toHaveBeenCalled()
      expect(redirect).toHaveBeenCalledWith('/auth/login')
    })
  })
})