import Link from 'next/link'

import { Button } from '../ui/button'
import { FloatLabelInput, FloatLabelPasswordInput } from '../ui/float-label-input'

export default function SignUpForm() {
  return (
    <form className="flex w-xl flex-col gap-6">
      <h4 className="text-center text-4xl font-normal">Register now</h4>
      <p className="mb-4 text-center">Welcome! Sign up to continue</p>

      <FloatLabelInput type="email" label="Email" placeholder="example@mail.com" />
      <FloatLabelPasswordInput label="Password" placeholder="Enter your password" />

      <div className="flex flex-col items-center justify-between gap-2">
        <Button>Create Account</Button>
        <Button variant="ghost">
          <Link href="/auth/login">I have an account</Link>
        </Button>
      </div>
    </form>
  )
}
