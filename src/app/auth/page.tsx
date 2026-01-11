import { redirect } from 'next/navigation'

import { verifySession } from '@/lib/auth/session'

export default async function AuthIndex() {
  const session = await verifySession()

  if (session.isAuth) {
    redirect('/users')
  } else {
    redirect('/auth/login')
  }
}
