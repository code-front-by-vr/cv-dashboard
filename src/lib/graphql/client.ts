import 'server-only'

import { ClientError,GraphQLClient } from 'graphql-request'

import { getAccessToken } from '../auth/cookies.server'
import { refreshToken } from '../auth/refresh'

const endpoint = process.env.API_BASE_URL!

function createClient(token?: string) {
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined

  return new GraphQLClient(endpoint, {
    credentials: 'include',
    headers,
  })
}
export async function graphQlRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const token = await getAccessToken()
  const client = createClient(token)

  try {
    return await client.request<T>(query, variables)
  } catch (error) {
    if (error instanceof ClientError && error.response.status === 401) {
      const newToken = await refreshToken()

      if (!newToken) throw error

      return createClient(newToken).request<T>(query, variables)
    }

    throw error
  }
}
