import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'glass'
export type ButtonSize = 'sm' | 'md' | 'lg'

const VARIANTS: Record<ButtonVariant, string> = {
  // Cinematic brand→cyan gradient with a colored glow + glossy inset highlight.
  primary:
    'bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 bg-[length:200%_auto] bg-left text-white shadow-glow ring-1 ring-inset ring-white/20 hover:bg-right hover:shadow-glow-lg hover:-translate-y-0.5 active:translate-y-0',
  secondary: 'bg-white text-ink-800 border border-ink-200 hover:bg-ink-50 hover:border-ink-300',
  // Translucent button for dark/cinematic surfaces.
  glass: 'glass text-white hover:bg-white/[0.18] hover:-translate-y-0.5',
  ghost: 'bg-transparent text-ink-700 hover:bg-ink-100',
  danger: 'bg-danger-600 text-white shadow-card hover:bg-danger-700',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-body-sm',
  md: 'h-11 px-5 text-body-sm',
  lg: 'h-12 px-6 text-body',
}

/**
 * Shared button styling. Exported so anchor/Link elements can adopt the exact
 * same appearance (DRY) without re-wrapping them in a <button>.
 */
export function buttonStyles(variant: ButtonVariant = 'primary', size: ButtonSize = 'md'): string {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-card',
    VARIANTS[variant],
    SIZES[size],
  )
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return <button className={cn(buttonStyles(variant, size), className)} {...props} />
}
