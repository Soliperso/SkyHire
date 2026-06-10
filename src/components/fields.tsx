import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { useId } from 'react'
import { cn } from '@/lib/cn'

const CONTROL =
  'w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-body-sm text-white placeholder:text-ink-400 transition-colors focus:border-brand-400 focus:bg-white/[0.07]'

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string
  htmlFor: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-body-sm font-semibold text-ink-200">
        {label}
      </label>
      {children}
      {hint && <p className="text-caption text-ink-400">{hint}</p>}
    </div>
  )
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
}

export function TextField({ label, hint, className, ...props }: TextFieldProps) {
  const id = useId()
  return (
    <Field label={label} htmlFor={id} hint={hint}>
      <input id={id} className={cn(CONTROL, className)} {...props} />
    </Field>
  )
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  hint?: string
}

export function TextArea({ label, hint, className, rows = 4, ...props }: TextAreaProps) {
  const id = useId()
  return (
    <Field label={label} htmlFor={id} hint={hint}>
      <textarea id={id} rows={rows} className={cn(CONTROL, 'resize-y', className)} {...props} />
    </Field>
  )
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  hint?: string
  options: { value: string; label: string }[]
}

export function SelectField({ label, hint, options, className, ...props }: SelectFieldProps) {
  const id = useId()
  return (
    <Field label={label} htmlFor={id} hint={hint}>
      <select id={id} className={cn(CONTROL, 'appearance-none pr-8 [&>option]:text-ink-900', className)} {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </Field>
  )
}
