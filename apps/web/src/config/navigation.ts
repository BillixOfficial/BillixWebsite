import { categoryIndex } from '@/content/category-index'

export interface NavLink {
  label: string
  href: string
  description?: string
}

export interface NavItem {
  label: string
  href: string
  children?: NavLink[]
  /** Footer link shown at the bottom of a dropdown. */
  allLink?: NavLink
}

export const primaryNav: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Learn',
    href: '/learn',
    children: [
      { label: 'Articles & Guides', href: '/learn', description: 'Plain-English explainers, with sources.' },
      { label: 'Videos with Alice', href: '/videos', description: 'Long videos and Shorts.' },
      { label: 'Bill Updates', href: '/updates', description: 'Dated changes to rates and fees.' },
      { label: 'Glossary', href: '/glossary', description: 'Billing terms, A to Z.' },
      { label: 'Bills by State', href: '/states', description: 'Resources for all 50 states and D.C.' },
      { label: 'Ask Alice', href: '/ask-alice', description: 'Our upcoming bill assistant.' },
    ],
  },
  {
    label: 'Explore Bills',
    href: '/categories',
    children: categoryIndex.map((c) => ({ label: c.shortName, href: `/categories/${c.slug}` })),
    allLink: { label: 'All 12 bill categories', href: '/categories' },
  },
  {
    label: 'Tools',
    href: '/tools',
    children: [
      { label: 'Electricity Cost Calculator', href: '/tools/electricity-cost', description: 'Estimate a bill or one appliance.' },
      { label: 'Compare Electricity Plans', href: '/compare/electricity-plans', description: 'Two plans, your usage, side by side.' },
    ],
    allLink: { label: 'All tools and what’s coming', href: '/tools' },
  },
  { label: 'Compare', href: '/compare' },
  { label: 'Shop', href: '/shop' },
  { label: 'Community', href: '/community' },
  { label: 'Bill of the Month', href: '/bill-of-the-month' },
  { label: 'Get the App', href: '/app' },
]

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: 'Explore',
    links: [
      { label: 'Bill Categories', href: '/categories' },
      { label: 'Electricity', href: '/categories/electricity' },
      { label: 'Heating', href: '/categories/heating-cooling' },
      { label: 'Water', href: '/categories/water-sewer' },
      { label: 'Internet', href: '/categories/internet-phone' },
      { label: 'Insurance', href: '/categories/insurance' },
      { label: 'By State', href: '/states' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Learn', href: '/learn' },
      { label: 'Calculators', href: '/tools' },
      { label: 'Compare', href: '/compare' },
      { label: 'Ask Alice', href: '/ask-alice' },
      { label: 'Newsletter', href: '/newsletter' },
      { label: 'Bill of the Month', href: '/bill-of-the-month' },
      { label: 'Glossary', href: '/glossary' },
      { label: 'Help Center', href: '/help' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Our Mission', href: '/mission' },
      { label: 'Meet Alice', href: '/meet-alice' },
      { label: 'Contact', href: '/contact' },
      { label: 'Press', href: '/press' },
      { label: 'Partnerships', href: '/partnerships' },
      { label: 'Work With Us', href: '/work-with-us' },
      { label: 'For Relief Programs', href: '/business' },
      { label: 'Careers', href: '/careers' },
    ],
  },
  {
    title: 'Shop',
    links: [
      { label: 'The Handbook', href: '/shop/household-utility-savings-handbook' },
      { label: 'Free Printables', href: '/shop/collections/digital' },
      { label: 'Merchandise', href: '/shop/collections/apparel' },
      { label: 'Order Support', href: '/help#orders' },
    ],
  },
  {
    title: 'App',
    links: [
      { label: 'iOS', href: '/app#download' },
      { label: 'Android', href: '/app#download' },
      { label: 'App Updates', href: '/app#updates' },
    ],
  },
]

export const legalNav: NavLink[] = [
  { label: 'Privacy Policy', href: '/legal/privacy' },
  { label: 'Terms', href: '/legal/terms' },
  { label: 'Cookie Settings', href: '/legal/cookies' },
  { label: 'Affiliate Disclosure', href: '/legal/affiliate-disclosure' },
  { label: 'Accessibility', href: '/legal/accessibility' },
  { label: 'Shipping', href: '/legal/shipping' },
  { label: 'Returns', href: '/legal/returns' },
  { label: 'Digital Product Terms', href: '/legal/digital-product-terms' },
]
