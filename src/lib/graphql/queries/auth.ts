import type { AuthInput } from 'cv-graphql'

import type { LoginResponse } from '@/lib/types/graphql'

import { graphQlRequest } from '../client'

export async function loginQuery(auth: AuthInput) {
  return graphQlRequest<LoginResponse>(
    `
    query Login($auth: AuthInput!) {
      login(auth: $auth) {
        user {
          id
          email
        }
        access_token
        refresh_token
      }
    }
  `,
    { auth },
  )
}
