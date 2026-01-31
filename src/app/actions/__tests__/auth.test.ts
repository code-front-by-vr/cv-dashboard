import { describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/graphql/mutations/auth')
vi.mock('@/lib/graphql/queries/auth')
vi.mock('@/lib/auth/cookies.server')
vi.mock('next/navigation', () => {
  return {
    redirect: vi.fn()
  }
})

import { redirect } from 'next/navigation'

import { clearAuthCookie,setAuthCookie } from '@/lib/auth/cookies.server'
import { signUpMutation } from '@/lib/graphql/mutations/auth'
import { loginQuery } from '@/lib/graphql/queries/auth'
import type { LoginResponse } from '@/lib/types/graphql'

import { login, logout,signup } from '../auth'

describe('Auth actions', () => {
  describe('signup', () => {
    it('should successfully sign up user with valid data', async () => {
      const mockFormData = new FormData()
      mockFormData.set('email', 'test@example.com')
      mockFormData.set('password', 'password123')

      const mockResponse = {
        signup: {
          user: { id: '1', email: 'test@example.com' },
          access_token: 'access_token_123',
          refresh_token: 'refresh_token_123'
        }
      }

      vi.mocked(signUpMutation).mockResolvedValue(mockResponse)
      vi.mocked(setAuthCookie).mockResolvedValue()

      const result = await signup({ status: undefined }, mockFormData)

      expect(result?.status).toBe('success')
      expect(result?.message).toBe('Registration successful')
      expect(signUpMutation).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
      expect(setAuthCookie).toHaveBeenCalledWith({
        accessToken: mockResponse.signup.access_token,
        refreshToken: mockResponse.signup.refresh_token
      })

    })

    it('should return validation errors for invalid email', async () => {
      const mockFormData = new FormData()
      mockFormData.set('email', 'invalid-email')
      mockFormData.set('password', 'password123')

      const result = await signup({ status: undefined }, mockFormData)

      expect(result?.status).toBe('error')
      expect(result?.errors?.email).toBeDefined()
      expect(signUpMutation).not.toHaveBeenCalled()
    })

    it('should return validation error for short password', async () => {
      const mockFormData = new FormData()
      mockFormData.set('email', 'test@example.com')
      mockFormData.set('password', 'short')

      const result = await signup({ status: undefined }, mockFormData)

      expect(result?.status).toBe('error')
      expect(result?.errors?.password).toBeDefined()
      expect(signUpMutation).not.toHaveBeenCalled()
    })

    it('should handle signup mutation errors', async () => {
      const mockFormData = new FormData()
      mockFormData.set('email', 'test@example.com')
      mockFormData.set('password', 'password123')

      const error = new Error('User already exists')

      vi.mocked(signUpMutation).mockRejectedValue(error)

      const result = await signup({ status: undefined }, mockFormData)

      expect(result?.status).toBe('error')
      expect(result?.errors?._form).toBeDefined()
      expect(setAuthCookie).not.toHaveBeenCalled()
    })
  })

  describe('login', () => {
    it('should successfully login user with valid data', async () => {
      const mockFormData = new FormData()
      mockFormData.set('email', 'test@example.com')
      mockFormData.set('password', 'password123')

      const mockResponse: LoginResponse = {
        login: {
          user: { id: '1', email: 'test@example.com' },
          access_token: 'access_token_123',
          refresh_token: 'refresh_token_123'
        }
      }

      vi.mocked(loginQuery).mockResolvedValue(mockResponse)
      vi.mocked(setAuthCookie).mockResolvedValue()

      const result = await login({ status: undefined }, mockFormData)

      expect(result?.status).toBe('success')
      expect(result?.message).toBeDefined()
      expect(loginQuery).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
      expect(setAuthCookie).toHaveBeenCalledWith({
        accessToken: mockResponse.login.access_token,
        refreshToken: mockResponse.login.refresh_token
      })
    })

    it('should handle login query errors', async () => {
      const mockFormData = new FormData()
      mockFormData.set('email', 'test@example.com')
      mockFormData.set('password', 'wrong-password')

      const error = new Error('Invalid Credentials')

      vi.mocked(loginQuery).mockRejectedValue(error)

      const result = await login({ status: undefined }, mockFormData)

      expect(result?.status).toBe('error')
      expect(result?.errors?._form).toBeDefined()
      expect(setAuthCookie).not.toHaveBeenCalled()
    })

    it('should handle setAuthCookie errors', async () => {
      const mockFormData = new FormData()
      mockFormData.set('email', 'test@example.com')
      mockFormData.set('password', 'password123')

      const mockResponse: LoginResponse = {
        login: {
          user: { id: '1', email: 'test@example.com' },
          access_token: 'access_token_123',
          refresh_token: 'refresh_token_123'
        }
      }

      vi.mocked(loginQuery).mockResolvedValue(mockResponse)
      vi.mocked(setAuthCookie).mockRejectedValue(new Error('Set Auth Cookie Error'))

      const result = await login({ status: undefined }, mockFormData)

      expect(result?.status).toBe('error')
      expect(result?.errors?._form).toBeDefined()
    })

    it('should handle validation error for invalid email', async () => {
      const mockFormData = new FormData()
      mockFormData.set('email', 'invalid-email')
      mockFormData.set('password', 'password123')

      const result = await login({ status: undefined }, mockFormData)
      expect(result?.status).toBe('error')
      expect(result?.errors?.email).toBeDefined()
      expect(loginQuery).not.toHaveBeenCalled()
    })

    it('should handle validation error for short password', async () => {
      const mockFormData = new FormData()
      mockFormData.set('email', 'test@example.com')
      mockFormData.set('password', 'short')

      const result = await login({ status: undefined }, mockFormData)

      expect(result?.status).toBe('error')
      expect(result?.errors?.password).toBeDefined()
      expect(loginQuery).not.toHaveBeenCalled()
    })
  })

  describe('logout', () => {
    it('should successfully logout user', async () => {
      vi.mocked(clearAuthCookie).mockResolvedValue()

      const result = await logout()

      expect(clearAuthCookie).toHaveBeenCalled()
      expect(redirect).toHaveBeenCalledWith('/auth/login')
    })
  })
})