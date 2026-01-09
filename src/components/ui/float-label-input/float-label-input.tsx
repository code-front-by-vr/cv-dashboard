'use client'
import { type ChangeEvent, type FocusEvent, useId, useState } from 'react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

import type { FloatLabelInputProps } from './types'

export const FloatLabelInput = ({
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
}: FloatLabelInputProps) => {
  const generateId = useId()
  const inputId = id ?? generateId
  const [isFocused, setIsFocused] = useState(false)
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')

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
          value={value}
          defaultValue={defaultValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          className={cn(
            'form-input text-foreground h-12 w-full px-3 text-base',
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

FloatLabelInput.displayName = 'FloatLabelInput'
