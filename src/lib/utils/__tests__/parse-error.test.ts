import { describe, expect, it } from 'vitest'

import { getErrorMessage } from '../parse-error'

describe('getErrorMessage', () => {
  it('should return mapped error message for string error', () => {
    expect(getErrorMessage('Invalid credentials')).toBe('Invalid email or password.')
  })

  it('should return mapped error message for Error instance', () => {
    const error = new Error('Invalid credentials')
    expect(getErrorMessage(error)).toBe('Invalid email or password.')
  })

  it('should return mapped error message when error uncludes key', () => {
    expect(getErrorMessage('BadRequestException: Bad request. Please check the fields.')).toBe(
      'Bad request. Please check the fields.',
    )
  })

  it('should return default message for unknown error', () => {
    expect(getErrorMessage('Unknown error')).toBe('An unexpected error occurred')
  })
})
