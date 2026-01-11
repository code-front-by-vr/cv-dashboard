'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'

import type { FormState } from '../types/auth'

export function useFormToast(state: FormState<Record<string, string[]>>) {
  useEffect(() => {
    if (!state) return

    if (state.status === 'success' && state.message) {
      toast.success(state.message)
    }

    if (state.status === 'error' && state.errors) {
      state.errors._form?.forEach((msg) => {
        toast.error(msg)
      })
    }
  }, [state])
}
