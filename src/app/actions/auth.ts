'use server'

import { LoginFormSchema, SignUpFormSchema } from '@lib/validation/auth.schema'
import { redirect } from 'next/navigation'
import { z } from 'zod'

import { clearAuthCookie, setAuthCookie } from '@/lib/auth/cookies.server'
import { signUpMutation } from '@/lib/graphql/mutations/auth'
import { loginQuery } from '@/lib/graphql/queries/auth'
import type { LoginFormState,SignUpFormState } from '@/lib/types/auth'
import { getErrorMessage } from '@/lib/utils/parse-error'

export async function signup(
  _state: SignUpFormState,
  formData: FormData,
): Promise<SignUpFormState> {
  const validatedFields = SignUpFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      status: 'error',
      errors: z.flattenError(validatedFields.error).fieldErrors,
    }
  }
  try {
    const result = await signUpMutation(validatedFields.data)

    await setAuthCookie({
      accessToken: result.signup.access_token,
      refreshToken: result.signup.refresh_token,
    })

    return {
      status: 'success',
      message: 'Registration successful',
    }
  } catch (error: unknown) {
    return {
      status: 'error',
      errors: {
        _form: [ getErrorMessage(error)],
      },
    }
  }
}

export async function login(_state: LoginFormState, formData: FormData): Promise<LoginFormState> {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      status: 'error',
      errors: z.flattenError(validatedFields.error).fieldErrors,
    }
  }
  try {
    const result = await loginQuery(validatedFields.data)

    await setAuthCookie({
      accessToken: result.login.access_token,
      refreshToken: result.login.refresh_token,
    })

    return {
      status: 'success',
      message: 'Welcome back!',
    }
  } catch (error: unknown) {
    return {
      status: 'error',
      errors: {
        _form: [getErrorMessage(error)],
      },
    }
  }
}

export async function logout() {
  await clearAuthCookie()
  redirect('/auth/login')
}
