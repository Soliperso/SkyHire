/** Join conditional class names (tiny clsx replacement) — keeps JSX tidy. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}
