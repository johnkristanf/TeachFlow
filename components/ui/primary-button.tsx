import React from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Color = 'blue' | 'red' | 'black' | 'green'
type Size = 'sm' | 'md'
type Variant = 'solid' | 'outline'

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
    color?: Color
    variant?: Variant
    size?: Size
    className?: string
}

const baseStyles =
    'flex items-center justify-center gap-2 rounded-md hover:cursor-pointer  transition-colors disabled:opacity-50 font-medium'

const variants: Record<Variant, Record<Color, string>> = {
    solid: {
        blue: 'bg-blue-600 hover:bg-blue-700 text-white',
        red: 'bg-red-600 hover:bg-red-700 text-white',
        black: 'bg-gray-800 hover:bg-gray-900 text-white',
        green: 'bg-green-600 hover:bg-green-700 text-white',
    },
    outline: {
        black: 'border border-gray-900 text-gray-600 hover:bg-gray-300',
        blue: 'border border-blue-900 text-blue-600 hover:bg-blue-200',
        red: 'border border-red-900 text-red-600 hover:bg-red-200',
        green: 'border border-green-900 text-green-600 hover:bg-green-200',

    },
}

const sizes = {
    sm: 'px-2 py-1',
    md: 'px-4 py-2',
}

export function PrimaryButton({
    children,
    color = 'blue',
    variant = 'solid',
    size = 'sm',
    className,
    ...props
}: PrimaryButtonProps) {
    return (
        <button
            className={cn(baseStyles, variants[variant][color], sizes[size], className)}
            {...props}
        >
            {children}
        </button>
    )
}
