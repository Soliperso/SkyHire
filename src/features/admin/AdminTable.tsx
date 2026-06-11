import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Shared dark table for admin console tables — one source for header/cell styling. */
export function AdminTable({ head, children }: { head: ReactNode[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-body-sm">
        <thead>
          <tr className="bg-white/5">
            {head.map((h, i) => (
              <th key={i} className="px-5 py-3 font-semibold text-ink-300">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export function Tr({ children }: { children: ReactNode }) {
  return <tr className="border-t border-white/10">{children}</tr>
}

export function Td({ children, className }: { children: ReactNode; className?: string }) {
  return <td className={cn('px-5 py-4 align-top', className)}>{children}</td>
}
