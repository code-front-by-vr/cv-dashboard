import { graphql, HttpResponse } from 'msw'

import type { AuthInput } from '@/lib/types/auth'
import type { LoginResponse, SignupResponse, UpdateTokenResponse } from '@/lib/types/graphql'

const api = graphql.link(process.env.API_BASE_URL!)

export const authHandlers = [
  api.mutation<SignupResponse, { auth: AuthInput }>('Signup', ({ variables }) => {
    const { email } = variables.auth

    return HttpResponse.json({
      data: {
        signup: {
          user: { id: '1', email },
          access_token: 'mock_access_token',
          refresh_token: 'mock_refresh_token',
        },
      },
    })
  }),

  api.query<LoginResponse, { auth: AuthInput }>('Login', ({ variables }) => {
    const { email } = variables.auth

    return HttpResponse.json({
      data: {
        login: {
          user: { id: '1', email },
          access_token: 'mock_access_token',
          refresh_token: 'mock_refresh_token',
        },
      },
    })
  }),

  api.mutation<UpdateTokenResponse>('UpdateToken', () => {
    return HttpResponse.json({
      data: {
        updateToken: {
          access_token: 'refreshed_access_token',
          refresh_token: 'refreshed_refresh_token',
        },
      },
    })
  }),
]
