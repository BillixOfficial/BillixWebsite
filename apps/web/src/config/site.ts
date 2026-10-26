/**
 * Site-wide configuration. Anything that differs per environment (URLs, social
 * handles, store links) comes from environment variables so nothing is invented
 * in code. Unset values make the related UI show an honest "not yet" state.
 */

const env = (value: string | undefined) => (value && value.trim() ? value.trim() : null)

export const site = {
  name: 'Billix',
  tagline: 'Understand Your Bills. Keep More of Your Money.',
  description:
    'Billix explains the household bills you pay: why costs change, how charges are calculated, and what options you have. Free guides, calculators and videos with Alice.',
  url: env(process.env.NEXT_PUBLIC_SITE_URL) ?? 'http://localhost:3000',
  email: 'info@billixapp.com',
  /** Base URL of the Billix API (apps/api). Forms are disabled when unset. */
  apiUrl: env(process.env.NEXT_PUBLIC_API_URL),
} as const

export type SocialPlatform =
  | 'youtube'
  | 'tiktok'
  | 'instagram'
  | 'facebook'
  | 'linkedin'
  | 'pinterest'
  | 'x'
  | 'threads'

export interface SocialLink {
  platform: SocialPlatform
  label: string
  url: string | null
}

// Official Billix profiles. Env vars override them per environment; a null URL shows as "coming soon".
// NEXT_PUBLIC_* vars must be referenced literally so Next.js can inline them.
export const socialLinks: SocialLink[] = [
  { platform: 'youtube', label: 'YouTube', url: env(process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE) ?? 'https://www.youtube.com/channel/UCt9vN1jnKS5UJuqqlhlUixQ' },
  { platform: 'tiktok', label: 'TikTok', url: env(process.env.NEXT_PUBLIC_SOCIAL_TIKTOK) ?? 'https://www.tiktok.com/@billixhelps' },
  { platform: 'linkedin', label: 'LinkedIn', url: env(process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN) ?? 'https://www.linkedin.com/company/billix-llc/' },
  // Instagram account not created yet: placeholder until a URL is set.
  { platform: 'instagram', label: 'Instagram', url: env(process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM) },
  { platform: 'facebook', label: 'Facebook', url: env(process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK) },
  { platform: 'pinterest', label: 'Pinterest', url: env(process.env.NEXT_PUBLIC_SOCIAL_PINTEREST) },
  { platform: 'x', label: 'X', url: env(process.env.NEXT_PUBLIC_SOCIAL_X) },
  { platform: 'threads', label: 'Threads', url: env(process.env.NEXT_PUBLIC_SOCIAL_THREADS) },
]

/** The profiles we feature everywhere (live ones plus the Instagram placeholder). */
export const featuredSocial = socialLinks.filter((s) => ['youtube', 'tiktok', 'linkedin', 'instagram'].includes(s.platform))

export const activeSocialLinks = socialLinks.filter((s): s is SocialLink & { url: string } => !!s.url)

export const appStores = {
  ios: env(process.env.NEXT_PUBLIC_APP_STORE_URL),
  android: env(process.env.NEXT_PUBLIC_PLAY_STORE_URL),
}

/** Feature flags. Flip to true only when the feature is genuinely live. */
export const features = {
  accounts: false,
  askAlice: false,
  appLaunched: !!(appStores.ios || appStores.android),
} as const

export const siteUrl = (path = '/') => new URL(path, site.url).toString()
