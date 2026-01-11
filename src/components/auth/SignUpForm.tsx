'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useActionState } from 'react'
import { useEffect } from 'react'

import { signup } from '@/app/actions/auth'
import { useFormToast } from '@/lib/hooks/use-form-toast'

import { Button } from '../ui/button'
import { FloatLabelInput, FloatLabelPasswordInput } from '../ui/float-label-input'

export default function SignUpForm() {
  const router = useRouter()
  const [state, action, pending] = useActionState(signup, undefined)

  useFormToast(state)

  useEffect(() => {
    if (state?.status !== 'success') return

    router.push('/users')
  }, [router, state?.status])

  return (
    <form action={action} className="flex w-xl flex-col gap-6">
      <h4 className="text-center text-4xl font-normal">Register now</h4>
      <p className="mb-4 text-center">Welcome! Sign up to continue</p>

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
          Create Account
        </Button>
        <Button variant="ghost">
          <Link href="/auth/login">I have an account</Link>
        </Button>
      </div>
    </form>
  )
}
