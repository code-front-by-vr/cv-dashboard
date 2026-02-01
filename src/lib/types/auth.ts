import type { AuthInput } from 'cv-graphql'

export type FormState<TFields extends Record<string, string[]>> =
  | {
      status?: 'success' | 'error'
      message?: string
      errors?: Partial<TFields> & {
        _form?: string[]
      }
    }
  | undefined

export type SignUpFormState = FormState<{
  email: string[]
  password: string[]
}>

export type LoginFormState = FormState<{
  email: string[]
  password: string[]
}>

export type SessionData = {
  isAuth: true
  userId: string
  email: string
  role: 'Employee' | 'Admin'
}

export { type AuthInput }
