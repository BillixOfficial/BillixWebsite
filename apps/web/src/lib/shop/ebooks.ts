import { readFile } from 'node:fs/promises'
import path from 'node:path'

/**
 * Paid ebooks are kept in apps/web/private (never in public/), so the only way to get
 * one is the download route, which checks the Stripe order first. next.config.ts
 * bundles this folder with that route. Replacing the file updates every buyer's link.
 */
const ebooks: Record<string, { file: string; downloadName: string }> = {
  'household-utility-savings-handbook': { file: 'billix-handbook-2026.pdf', downloadName: 'Billix-Household-Utility-Savings-Handbook-2026.pdf' },
}

export const ebookSlugs = Object.keys(ebooks)

export async function readEbook(slug: string) {
  const e = ebooks[slug]
  if (!e) return null
  const data = await readFile(path.join(process.cwd(), 'private', 'ebooks', e.file))
  return { data, downloadName: e.downloadName }
}
