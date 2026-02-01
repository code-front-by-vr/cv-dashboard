'use client'

import { usePathname, useRouter } from 'next/navigation'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

export default function AuthTabs({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  const current = pathname.includes('/signup') ? 'signup' : 'login'
  const indicatorX = current === 'signup' ? 'translate-x-full' : 'translate-x-0'

  function handleChangeAuthTab(value: string) {
    router.push(`/auth/${value}`)
  }

  return (
    <Tabs value={current} onValueChange={handleChangeAuthTab} className="contents">
      <header className="flex justify-center">
        <TabsList className="relative grid min-w-[20rem] grid-cols-2">
          <span aria-hidden className={cn('tab-indicator', indicatorX)} />
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
      </header>

      <TabsContent value={current} className="grid place-content-center p-4">
        {children}
      </TabsContent>
    </Tabs>
  )
}
