import { z } from 'zod'

export const SignUpFormSchema = z.object({
  email: z.email({ error: 'Please enter a valid email' }).trim(),
  password: z.string().min(8, { error: 'Be at least 8 characters long' }).trim(),
})

export const LoginFormSchema = z.object({
  email: z.email({ error: 'Please enter a valid email' }).trim(),
  password: z.string().min(8, { error: 'Be at least 8 characters long' }).trim(),
})
