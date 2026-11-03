import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Inter, Courier_Prime } from 'next/font/google'
import './globals.css'
import { site } from '@/config/site'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { CartProvider } from '@/components/shop/cart'

const inter = Inter({ variable: '--font-inter', subsets: ['latin'], display: 'swap' })
const bricolage = Bricolage_Grotesque({ variable: '--font-bricolage', subsets: ['latin'], display: 'swap' })
const receipt = Courier_Prime({ variable: '--font-mono-receipt', subsets: ['latin'], weight: ['400', '700'], display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'Billix: Understand Your Bills. Keep More of Your Money.', template: '%s | Billix' },
  description: site.description,
  applicationName: 'Billix',
  openGraph: {
    type: 'website',
    siteName: 'Billix',
    title: 'Billix: Your bills shouldn’t be a mystery',
    description: site.description,
    images: [{ url: '/brand/og-image.png', width: 1200, height: 630, alt: 'Billix' }],
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: '/' },
}

export const viewport: Viewport = {
  themeColor: '#fbfaf7',
}

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Billix',
  url: site.url,
  logo: `${site.url}/brand/billix-logo.png`,
  email: site.email,
  description: site.description,
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${bricolage.variable} ${receipt.variable} antialiased`}>
      <body className="flex min-h-screen flex-col">
        {/* Enables scroll-reveal styles only when JavaScript runs, so content is never hidden without it. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <CartProvider>
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  )
}
