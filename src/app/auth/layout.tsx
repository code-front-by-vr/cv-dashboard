'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    router.prefetch('/users')
  }, [router])

  const current = pathname.includes('/signup') ? 'signup' : 'login'
  const indicatorX = current === 'signup' ? 'translate-x-full' : 'translate-x-0'

  function handleChangeAuthTab(value: string) {
    router.push(`/auth/${value}`)
  }

  return (
    <div className="flex min-h-screen items-start justify-center">
      <Tabs value={current} onValueChange={handleChangeAuthTab}>
        <TabsList className="relative grid min-w-[20rem] grid-cols-2">
          <span aria-hidden className={cn('tab-indicator', indicatorX)} />
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <div>{children}</div>
      </Tabs>
    </div>
  )
}
