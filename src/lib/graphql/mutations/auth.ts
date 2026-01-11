import type { AuthInput } from 'cv-graphql'

import type { SignupResponse, UpdateTokenResponse } from '@/lib/types/graphql'

import { graphQlRequest } from '../client'

export async function signUpMutation(auth: AuthInput) {
  return graphQlRequest<SignupResponse>(
    `
    mutation Signup($auth: AuthInput!) {
      signup(auth: $auth) {
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

export async function updateTokenMutation() {
  return graphQlRequest<UpdateTokenResponse>(
    `
    mutation UpdateToken {
      updateToken {
        access_token
        refresh_token
      }
    }
  `,
  )
}
