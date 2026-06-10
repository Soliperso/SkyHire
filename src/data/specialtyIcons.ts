import {
  Buildings,
  Camera,
  HardHat,
  MapTrifold,
  Confetti,
  House,
  Plant,
  Sun,
  type Icon,
} from '@phosphor-icons/react'
import type { Specialty } from './types'

/** Single source mapping each specialty to its icon (used on cards & grids). */
export const SPECIALTY_ICONS: Record<Specialty, Icon> = {
  'aerial-photography': Camera,
  'roof-inspection': House,
  'mapping-surveying': MapTrifold,
  'real-estate': Buildings,
  construction: HardHat,
  'event-coverage': Confetti,
  agriculture: Plant,
  'solar-inspection': Sun,
}
