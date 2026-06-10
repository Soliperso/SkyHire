import { Aurora } from '@/components/decor/Aurora'

/**
 * Cinematic dark hero backdrop. A clearly-visible aerial photo, darkened toward
 * the left/bottom so the headline stays legible while the imagery reads on the
 * right, with a cyan glow and subtle grid/grain on top.
 *
 * Want video instead? Drop a file at `public/hero.mp4` and swap the <img> for a
 * muted, looped, autoplaying <video> with the same classes.
 */
const HERO_IMAGE =
  'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=2400&q=80'

export function HeroBackground() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden bg-ink-950">
      {/* Aerial photograph — fully visible; gradients below control legibility. */}
      <img
        src={HERO_IMAGE}
        alt=""
        className="h-full w-full scale-125 translate-x-[10%] object-cover"
        fetchPriority="high"
      />

      {/* Darken left (where the copy sits) and fade the rest so the photo shows. */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/55 to-transparent" />
      {/* Vertical fade: subtle top, strong bottom for blending into the next section. */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/40 via-transparent to-ink-950" />
      {/* Radial cyan glow (kept light so it doesn't wash out the image). */}
      <div className="absolute inset-0 bg-[radial-gradient(50%_50%_at_15%_12%,rgba(56,189,248,0.18),transparent_60%)]" />

      {/* Animated glow blobs — low opacity to preserve the photo. */}
      <Aurora className="opacity-40" />

      {/* Texture. */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 bg-grain opacity-[0.06] mix-blend-overlay" />
    </div>
  )
}
