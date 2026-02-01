const ERROR_MAP: Record<string, string> = {
  'Invalid credentials': 'Invalid email or password.',
  'User already exists': 'User already exists.',
  BadRequestException: 'Bad request. Please check the fields.',
  INTERNAL_SERVER_ERROR: 'Server error. Please try again later.',
}

export function getErrorMessage(error: unknown): string {
  const errorString = error instanceof Error ? error.message : String(error)

  for (const [key, value] of Object.entries(ERROR_MAP)) {
    if (errorString.includes(key)) {
      return value
    }
  }

  return 'An unexpected error occurred'
}
