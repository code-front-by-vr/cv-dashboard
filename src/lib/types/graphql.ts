export type User = {
  id: string
  email: string
}

export type AuthResult = {
  user: User
  access_token: string
  refresh_token: string
}

export type SignupResponse = {
  signup: AuthResult
}

export type LoginResponse = {
  login: AuthResult
}

export type UpdateTokenResponse = {
  updateToken: {
    access_token: string
    refresh_token: string
  }
}
