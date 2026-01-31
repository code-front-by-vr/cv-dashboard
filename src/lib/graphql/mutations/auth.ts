import type { AuthInput } from 'cv-graphql'
import { GraphQLClient } from 'graphql-request'

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

//TODO: Remove after testing

// export async function updateTokenMutation() {
//   return graphQlRequest<UpdateTokenResponse>(
//     `
//     mutation UpdateToken {
//       updateToken {
//         access_token
//         refresh_token
//       }
//     }
//   `,
//   )
// }

const endpoint = process.env.API_BASE_URL!

const authClient = new GraphQLClient(endpoint)

export async function updateTokenMutation() {
  const query = `
    mutation UpdateToken {
      updateToken {
        access_token
        refresh_token
      }
    }
  `
  return authClient.request<UpdateTokenResponse>(query)
}
