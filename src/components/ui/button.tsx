import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { twMerge } from '@/utils/tw-merge'

const buttonVariants = cva(
	'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
	{
		variants: {
			variant: {
				default: 'bg-dark-900 text-light-900 hover:bg-dark-900/80 border border-neutral-600 w-full',
				secondary:
					'bg-light-900 text-dark-900 hover:bg-light-900/80 w-full border border-neutral-600',
				destructive: 'bg-red-500 text-neutral-50 shadow-sm hover:bg-red-500/90',
				ghost:
					'bg-transparent rounded-full hover:bg-light-900/10 focus:outline-neutral-600 focus:ring-neutral-600',
			},
			size: {
				default: 'h-9 px-4 py-2',
				sm: 'rounded-md px-3 text-xs',
				lg: 'rounded-md px-8',
				icon: 'h-10 w-10',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
)

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : 'button'
		return (
			<Comp
				className={twMerge(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		)
	}
)
Button.displayName = 'Button'

export { Button, buttonVariants }

//  [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 dark:focus-visible:ring-neutral-300
