'use client'
import { Eye, EyeOff } from 'lucide-react'
import { type ChangeEvent, type FocusEvent, useId, useState } from 'react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

import type { FloatLabelPasswordInputProps } from './types'

export const FloatLabelPasswordInput = ({
  label,
  error,
  className,
  id,
  value,
  defaultValue,
  onFocus,
  onBlur,
  onChange,
  ref,
  ...props
}: FloatLabelPasswordInputProps) => {
  const generateId = useId()
  const inputId = id ?? generateId
  const [isFocused, setIsFocused] = useState(false)
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')
  const [showPassword, setShowPassword] = useState(false)

  const currentValue = value ?? internalValue
  const hasValue = String(currentValue).length > 0

  const isLabelFloating = isFocused || hasValue

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    onFocus?.(e)
  }

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    onBlur?.(e)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (value === null) {
      setInternalValue(e.target.value)
    }
    onChange?.(e)
  }

  return (
    <div className="form-group w-full text-left">
      <div className="form-input-wrapper relative w-full">
        <Input
          id={inputId}
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          value={value}
          defaultValue={defaultValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          className={cn(
            'form-input text-foreground h-12 w-full px-3 pr-10 text-base',
            'bg-background dark:bg-background',
            'rounded-none',
            'border',
            'placeholder:text-base placeholder:opacity-0 placeholder:transition-opacity',
            'transition-colors duration-200',
            'hover:border-muted-foreground disabled:hover:border-input',
            'focus:outline-none focus-visible:ring-0',
            'selection:bg-primary/20 selection:text-foreground',
            'autofill:shadow-[inset_0_0_0_1000px_rgb(var(--background))]',
            'autofill:[-webkit-text-fill-color:rgb(var(--foreground))]',
            !isFocused && !error && 'border-input',
            isFocused && 'border-primary!',
            isFocused && 'placeholder:opacity-100',
            hasValue && 'has-value placeholder:opacity-100',
            error && 'is-error border-primary!',
            className,
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="text-muted-foreground hover:text-foreground focus-visible:text-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer transition-colors duration-200 focus:outline-none"
        >
          {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
        </button>
        <label
          htmlFor={inputId}
          className={cn(
            'form-input__label pointer-events-none absolute left-3 origin-top-left text-base whitespace-nowrap transition-all duration-200 select-none',
            !isLabelFloating && 'text-muted-foreground top-1/2 -translate-y-1/2 scale-100',
            isLabelFloating && 'bg-background top-0 -translate-y-1/2 scale-75 px-1',
            !isFocused && !error && 'text-muted-foreground',
            isFocused && 'text-primary',
            error && 'text-primary',
          )}
        >
          {label}
        </label>
      </div>
      {error && <p className="form-error text-secondary mt-1 text-xs">{error}</p>}
    </div>
  )
}

FloatLabelPasswordInput.displayName = 'FloatLabelPasswordInput'
