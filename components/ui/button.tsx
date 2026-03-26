import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 active:scale-95",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 border-b-4 border-primary/20 hover:border-primary/40',
        destructive:
          'bg-destructive text-white shadow-lg shadow-destructive/20 hover:bg-destructive/90 hover:shadow-xl hover:-translate-y-0.5 border-b-4 border-black/10',
        outline:
          'border-2 border-primary/20 bg-background shadow-sm hover:bg-primary/5 hover:border-primary/50 hover:text-primary hover:-translate-y-0.5',
        secondary:
          'bg-secondary text-secondary-foreground shadow-md hover:bg-secondary/80 hover:-translate-y-0.5 border-b-4 border-black/5',
        ghost:
          'hover:bg-primary/10 hover:text-primary font-semibold',
        link: 'text-primary underline-offset-4 hover:underline decoration-2',
      },
      size: {
        default: 'h-11 px-6 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-9 rounded-lg gap-1.5 px-4 has-[>svg]:px-2.5',
        lg: 'h-14 rounded-2xl px-10 text-base has-[>svg]:px-6',
        icon: 'size-11 rounded-xl',
        'icon-sm': 'size-9 rounded-lg',
        'icon-lg': 'size-14 rounded-2xl',
      },
    },
    defaultVariants: {
      variant: 'default',
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
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
