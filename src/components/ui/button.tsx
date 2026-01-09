import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2',
    'border cursor-pointer',
    'text-sm font-medium uppercase leading-none',
    'rounded-3xl transition-all duration-250',
    'outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
    'disabled:pointer-events-none',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-primary text-white border-primary',
          'hover:bg-[var(--btn-primary-hover)] hover:border-[var(--btn-primary-hover)]',
          'disabled:bg-[var(--btn-disabled-bg)] disabled:text-[var(--btn-disabled-text)] disabled:border-transparent',
        ],
        outline: [
          'bg-transparent text-[var(--btn-muted)] border-[var(--btn-muted)]/50',
          'hover:bg-[var(--btn-muted-hover)] hover:border-[var(--btn-muted)]',
          'disabled:bg-[var(--btn-disabled-bg)] disabled:text-[var(--btn-disabled-text)] disabled:border-transparent',
        ],
        ghost: [
          'bg-transparent text-[var(--btn-muted)] border-transparent',
          'hover:bg-[var(--btn-muted-hover)]',
          'disabled:text-[var(--btn-disabled-text)]',
        ],
        'ghost-secondary': [
          'bg-transparent text-primary border-transparent',
          'hover:bg-primary/10',
          'disabled:text-[var(--btn-disabled-text)]',
        ],
      },
      size: {
        default: 'min-w-56 py-4 px-4',
        sm: 'min-w-36 py-3 px-3 text-xs',
        lg: 'min-w-80 py-5 px-6',
        icon: 'size-10 min-w-0 rounded-full p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
