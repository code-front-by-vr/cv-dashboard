import AuthTabs from '@/components/authTabs'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-start justify-center">
      <AuthTabs>{children}</AuthTabs>
    </div>
  )
}
