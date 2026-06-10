import { Link } from 'react-router-dom'
import { ArrowUpRight } from '@phosphor-icons/react'
import type { Specialty } from '@/data/types'
import { SPECIALTY_LABELS } from '@/data/labels'
import { SPECIALTY_ICONS } from '@/data/specialtyIcons'
import { ROUTES } from '@/routes'

/** Specialty entry point — links into Browse pre-filtered by category. */
export function SpecialtyCard({ specialty }: { specialty: Specialty }) {
  const Icon = SPECIALTY_ICONS[specialty]
  return (
    <Link
      to={`${ROUTES.browse()}?specialty=${specialty}`}
      className="glass group relative flex items-center gap-3 overflow-hidden rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.14]"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10 text-accent-300 transition-colors group-hover:bg-gradient-to-br group-hover:from-brand-600 group-hover:to-accent-500 group-hover:text-white">
        <Icon className="h-5 w-5" />
      </span>
      <span className="flex-1 text-body-sm font-semibold text-white">
        {SPECIALTY_LABELS[specialty]}
      </span>
      <ArrowUpRight className="h-4 w-4 text-ink-400 transition-colors group-hover:text-accent-300" />
    </Link>
  )
}
