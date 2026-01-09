import type { InputHTMLAttributes, Ref } from 'react'

export type FloatLabelBaseProps = {
  label: string
  error?: string
}

export type FloatLabelInputProps = FloatLabelBaseProps &
  InputHTMLAttributes<HTMLInputElement> & { ref?: Ref<HTMLInputElement> }

export type FloatLabelPasswordInputProps = Omit<FloatLabelInputProps, 'type'>
