'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useActionState } from 'react'

import { login } from '@/app/actions/auth'
import { useFormToast } from '@/lib/hooks/use-form-toast'

import { Button } from '../ui/button'
import { FloatLabelInput, FloatLabelPasswordInput } from '../ui/float-label-input'

const initialState = {
  message: '',
}

export default function LoginForm() {
  const router = useRouter()
  const [state, action, pending] = useActionState(login, initialState)

  useFormToast(state)
  useEffect(() => {
    if (state?.status !== 'success') return

    router.replace('/users')
  }, [router, state?.status])

  return (
    <form action={action} className="flex w-xl flex-col gap-6">
      <h4 className="text-center text-4xl font-normal">Welcome back</h4>
      <p className="mb-4 text-center">Hello again! Log in to continue</p>

      <FloatLabelInput
        name="email"
        type="email"
        label="Email"
        placeholder="example@mail.com"
        error={state?.errors?.email?.join(', ')}
      />
      <FloatLabelPasswordInput
        name="password"
        label="Password"
        placeholder="Enter your password"
        error={state?.errors?.password?.join(', ')}
      />

      <div className="flex flex-col items-center justify-between gap-2">
        <Button type="submit" disabled={pending}>
          Log In
        </Button>
        <Button variant="ghost">
          <Link href="/auth/forgot-password">Forgot password?</Link>
        </Button>
      </div>
    </form>
  )
}
