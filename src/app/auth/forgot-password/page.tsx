import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { FloatLabelInput } from '@/components/ui/float-label-input'

export default function ForgotPassword() {
  return (
    <form className="flex w-xl flex-col gap-6">
      <h4 className="text-center text-4xl font-normal">Forgot password?</h4>
      <p className="mb-4 text-center">We will sent you an email with further instructions</p>

      <FloatLabelInput type="email" label="Email" placeholder="example@mail.com" />

      <div className="flex flex-col items-center justify-between gap-2">
        <Button>Reset Password</Button>
        <Button variant="ghost">
          <Link href="/auth/login">Cancel</Link>
        </Button>
      </div>
    </form>
  )
}
