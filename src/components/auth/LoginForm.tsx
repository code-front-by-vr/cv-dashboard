import Link from 'next/link'

import { Button } from '../ui/button'
import { FloatLabelInput, FloatLabelPasswordInput } from '../ui/float-label-input'

export default function LoginForm() {
  return (
    <form className="flex w-xl flex-col gap-6">
      <h4 className="text-center text-4xl font-normal">Welcome back</h4>
      <p className="mb-4 text-center">Hello again! Log in to continue</p>
      <FloatLabelInput type="email" label="Email" placeholder="example@mail.com" />
      <FloatLabelPasswordInput label="Password" placeholder="Enter your password" />
      <div className="flex flex-col items-center justify-between gap-2">
        <Button>Log In</Button>
        <Button variant="ghost">
          <Link href="/forgot-password">Forgot password?</Link>
        </Button>
      </div>
    </form>
  )
}
