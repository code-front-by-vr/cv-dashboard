import { logout } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { verifySession } from '@/lib/auth/session'

export default async function UsersPage() {
  const session = await verifySession()

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Users Page</h1>
      <div className="space-y-2">
        <p>✅ You are authenticated!</p>
        <p>Email: {session.email}</p>
        <p>Role: {session.role}</p>
        <p>User ID: {session.userId}</p>
      </div>
      <Button onClick={logout}>Logout</Button>
    </div>
  )
}
