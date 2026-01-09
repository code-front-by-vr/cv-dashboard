import AuthTabs from '@/components/auth/AuthTabs'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-dvh grid-rows-[auto_1fr]">
      <AuthTabs>{children}</AuthTabs>
    </main>
  )
}
