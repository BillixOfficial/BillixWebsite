import type { Product, ShopCollection } from './types'

/**
 * Planned Billix products. These are NOT existing inventory: every item is
 * 'coming_soon' or 'draft' until it is produced and checkout + fulfillment are live.
 * Prices are proposed and stored in cents so they can be changed in one place.
 */

const allCollections: { slug: ShopCollection; name: string; description: string }[] = [
  { slug: 'books', name: 'The Handbook', description: 'Our complete guide to the bills every home pays, as a PDF ebook.' },
  { slug: 'digital', name: 'Free Printables', description: 'Three free worksheets from the handbook, ready to print and fill in.' },
  { slug: 'workbooks', name: 'Workbooks & Planners', description: 'Planners for budgeting the year ahead.' },
  { slug: 'apparel', name: 'Apparel', description: 'Billix tees, hoodies and hats.' },
  { slug: 'accessories', name: 'Accessories', description: 'Mugs, notebooks and desk gear.' },
  { slug: 'bundles', name: 'Bundles & Gifts', description: 'Sets that pair well together.' },
]

const p = (
  slug: string,
  name: string,
  collection: ShopCollection,
  priceCents: number,
  format: Product['format'],
  description: string,
  extra: Partial<Product> = {},
): Product => ({ slug, name, collection, priceCents, format, status: 'coming_soon', description, ...extra })

export const products: Product[] = [
  // The handbook: the only Billix ebook
  p('household-utility-savings-handbook', 'The Billix Household Utility Savings Handbook', 'books', 2499, 'ebook',
    'The complete 2026 guide to the bills every US household pays: electricity, heating fuel, water, sewer, trash, internet and phone. Learn how each bill is built, find what you can cut, and measure what you actually save.',
    {
      featured: true,
      details: ['246-page PDF, US Letter, 2026 edition', '14 chapters covering seven household bills', '26 worksheets, letters, scripts and checklists', '55 charts, diagrams and annotated sample bills', 'Facts checked through October 2026'],
      inside: [
        'Introduction: why understanding your bills matters, with an opening assessment',
        'Understanding household utility bills',
        'Electricity',
        'Natural gas, propane, heating oil and other fuels',
        'Heating, cooling, insulation and home efficiency',
        'Water',
        'Sewer, wastewater and stormwater',
        'Home internet and TV',
        'Mobile phone service',
        'Trash and recycling',
        'Billing disputes, negotiation and consumer protection',
        'Renters, homeowners and moving',
        'Financial assistance, discounts and hardship programs',
        'Smart upgrades and return on investment',
        'The Billix 30-day and 90-day savings plans',
        'Appendix: scripts and letters, core worksheets, glossary and a reference index',
      ],
      specs: [
        { label: 'Format', value: 'PDF ebook, US Letter' },
        { label: 'Pages', value: '246' },
        { label: 'Edition', value: '2026' },
        { label: 'Figures', value: '55 charts, diagrams and sample bills' },
        { label: 'Tools', value: '26 worksheets, letters and checklists' },
        { label: 'Facts checked', value: 'Through October 2026' },
      ],
    }),
  // Digital downloads
  // Free printables: each is built from one of the handbook's tools by handbook/printables/printables.py (Billix_YouTube repo).
  p('monthly-bill-tracker', 'Monthly Bill Tracker', 'digital', 0, 'digital-download', 'See a full year of household bills in one place: a year-at-a-glance grid, a page for every month with due dates and use, a provider directory, and a calendar of seasonal checks.', { featured: true, downloadUrl: '/downloads/billix-monthly-bill-tracker.pdf', details: ['Year-at-a-glance grid for every bill', 'Monthly page: due date, amount, use, last year', 'Provider directory with promotion end dates', '12-month calendar of seasonal checks'] }),
  p('15-minute-bill-audit', 'The 15-Minute Bill Audit', 'digital', 0, 'digital-download', 'Check any utility bill in 15 minutes: confirm the reading and the dates, compare it with last month and last year, and split a change into days, price, fixed charges and use.', { featured: true, downloadUrl: '/downloads/billix-15-minute-bill-audit.pdf', details: ['Minute-by-minute steps', 'A worksheet to split a change into its causes', 'Two record sheets with tall write-in rows', 'What each result means and what to do next'] }),
  p('annual-bill-budget-planner', 'Annual Bill Budget Planner', 'digital', 699, 'digital-download', 'Plan a year of bills, including the once-a-year ones.', { status: 'draft' }),
  p('utility-comparison-worksheet', 'Utility Comparison Worksheet', 'digital', 399, 'digital-download', 'Compare plans and rates side by side on equal terms.', { status: 'draft' }),
  p('home-maintenance-planner', 'Home Maintenance Planner', 'digital', 599, 'digital-download', 'A seasonal schedule for the upkeep that prevents big bills.', { status: 'draft' }),
  p('first-time-homeowner-checklist', 'First-Time Homeowner Checklist', 'digital', 0, 'digital-download', 'Accounts to set up and costs to expect in your first year.', { status: 'draft' }),
  p('moving-utilities-checklist', 'Moving Utilities Checklist', 'digital', 0, 'digital-download', 'Every service to stop, start or transfer when you move, in the right order: a timeline from weeks before to after the move, a tracker for each service, a meter-reading log and a final-bill and deposit check.', { featured: true, downloadUrl: '/downloads/billix-moving-utilities-checklist.pdf', details: ['A timeline from weeks before to after the move', 'A tracker for all seven services', 'Meter-reading log for the old and new home', 'Final-bill and deposit check'] }),
  p('subscription-audit-worksheet', 'Subscription Audit Worksheet', 'digital', 0, 'digital-download', 'List, total and review every subscription you pay for.', { status: 'draft' }),
  p('electricity-usage-log', 'Electricity Usage Log', 'digital', 299, 'digital-download', 'Track meter readings and spot unusual usage early.', { status: 'draft' }),
  p('home-heating-comparison-kit', 'Home Heating Comparison Kit', 'digital', 799, 'digital-download', 'Worksheets to compare fuels, equipment and quotes.', { status: 'draft' }),
  p('household-planner-bundle', 'Complete Household Planner Bundle', 'bundles', 1999, 'bundle', 'Every Billix tracker and planner in one download.', { status: 'draft' }),
  // Apparel
  p('classic-tee', 'Chenille Piggy Tee', 'apparel', 3899, 'apparel', 'Our piggy bank as a fuzzy chenille letterman patch, standing on its stack of cash, with Billix in chain-stitch script above it.', { featured: true, variants: [{ name: 'Color', options: ['Washed Black', 'Chocolate Brown', 'Forest Green'] }, { name: 'Size', options: ['S', 'M', 'L', 'XL', '2XL'] }], details: ['Heavyweight garment-dyed cotton', 'Chenille and felt patch, chain-stitch script', 'Relaxed fit, thick ribbed collar'] }),
  p('little-piggy-tee', 'Little Piggy Tee', 'apparel', 2999, 'apparel', 'A small embroidered piggy bank on the chest with a gold coin on its way in. The quiet one you will wear every week.', { featured: true, variants: [{ name: 'Color', options: ['Oatmeal', 'Bone', 'Sky Blue'] }, { name: 'Size', options: ['S', 'M', 'L', 'XL', '2XL'] }], details: ['Heavyweight garment-dyed cotton', 'Dense satin-stitch embroidery', 'Relaxed fit, thick ribbed collar'] }),
  p('thread-painted-piggy-tee', 'Thread-Painted Piggy Tee', 'apparel', 3999, 'apparel', 'The whole Billix picture, piggy, cash and gold sun, stitched in layers of thread so it reads like a small piece of hand embroidery.', { variants: [{ name: 'Color', options: ['Oatmeal', 'Washed Black', 'Dusty Blue'] }, { name: 'Size', options: ['S', 'M', 'L', 'XL', '2XL'] }], details: ['Heavyweight garment-dyed cotton', 'Multi-shade thread-painted embroidery', 'Relaxed fit, thick ribbed collar'] }),
  p('one-line-piggy-tee', 'One-Line Piggy Tee', 'apparel', 3299, 'apparel', 'Our piggy bank drawn in one unbroken line of cream chain stitch, with a gold coin dropping in.', { variants: [{ name: 'Color', options: ['Sage', 'Slate Blue', 'Rust'] }, { name: 'Size', options: ['S', 'M', 'L', 'XL', '2XL'] }], details: ['Heavyweight garment-dyed cotton', 'Chain-stitch embroidery', 'Relaxed fit, thick ribbed collar'] }),
  p('corduroy-piggy-tee', 'Corduroy Piggy Tee', 'apparel', 3699, 'apparel', 'A big plum corduroy pig with its edges left to fray, stitched down with running stitches, and Billix in small script beside it.', { variants: [{ name: 'Color', options: ['Natural', 'Blush', 'Pale Sage'] }, { name: 'Size', options: ['S', 'M', 'L', 'XL', '2XL'] }], details: ['Heavyweight garment-dyed cotton', 'Corduroy appliqué that softens with each wash', 'Relaxed fit, thick ribbed collar'] }),
  p('alice-photo-tee', 'Alice Instant Photo Tee', 'apparel', 3299, 'apparel', 'Alice with her microphone, printed as an instant photo taped to the shirt, with her name written underneath.', { variants: [{ name: 'Color', options: ['Washed Black', 'Heather Gray', 'Sage'] }, { name: 'Size', options: ['S', 'M', 'L', 'XL', '2XL'] }], details: ['Heavyweight garment-dyed cotton', 'Full-color print', 'Relaxed fit, thick ribbed collar'] }),
  p('icon-sleeve-long-sleeve', 'Bill Icons Long Sleeve', 'apparel', 4299, 'apparel', 'A small embroidered piggy on the chest and the bills of the house stitched down one sleeve: light, heat, water, internet, home and a coin.', { variants: [{ name: 'Color', options: ['Bone', 'Heather Gray', 'Dusty Blue'] }, { name: 'Size', options: ['S', 'M', 'L', 'XL', '2XL'] }], details: ['Heavyweight garment-dyed cotton', 'Embroidered chest piggy and sleeve icons', 'Relaxed fit, ribbed cuffs'] }),
  p('signature-hoodie', 'Chenille Back Patch Hoodie', 'apparel', 6499, 'apparel', 'A small embroidered piggy on the chest and, across the back, a big chenille piggy on its stack of cash with Billix in script. Pick Plain for the chest piggy only.', { featured: true, variants: [{ name: 'Color', options: ['Forest Green', 'Washed Black', 'Chocolate Brown'] }, { name: 'Back', options: ['Chenille patch', 'Plain'] }, { name: 'Size', options: ['S', 'M', 'L', 'XL', '2XL'] }], details: ['Heavyweight garment-dyed brushed fleece', 'Satin-stitch chest piggy, optional chenille back patch', 'Double-layer hood, no drawstrings'] }),
  p('pocket-piggy-hoodie', 'Pocket Piggy Hoodie', 'apparel', 6499, 'apparel', 'A chenille piggy bank climbing out of the front pocket, with a gold coin waiting on the edge.', { variants: [{ name: 'Color', options: ['Oatmeal', 'Charcoal', 'Dusty Blue'] }, { name: 'Size', options: ['S', 'M', 'L', 'XL', '2XL'] }], details: ['Heavyweight garment-dyed brushed fleece', 'Chenille appliqué and embroidered coin', 'Double-layer hood, no drawstrings'] }),
  p('tote-bag', 'Chenille Piggy Tote', 'apparel', 2999, 'accessory', 'Heavy natural canvas with a colored base and long handles, and our chenille piggy with Billix in script on the front.', { variants: [{ name: 'Color', options: ['Deep Teal', 'Black', 'Chocolate Brown'] }], details: ['Heavy cotton canvas', 'Chenille patch, chain-stitch script', 'Long handles that fit over the shoulder'] }),
  p('alice-tote', 'Alice Tote', 'apparel', 2499, 'accessory', 'Alice with her own tote on her shoulder, ready for errands, printed on heavy natural canvas.', { variants: [{ name: 'Color', options: ['Rust', 'Deep Teal', 'Black'] }], details: ['Heavy cotton canvas', 'Full-color print', 'Long handles that fit over the shoulder'] }),
  // Accessories
  p('ceramic-mug', 'Billix Stoneware Mug', 'accessories', 1699, 'accessory', 'Speckled stoneware with a hand-thrown shape, dipped in a glossy deep teal glaze that runs at the edge, with our piggy bank drawn small on the front.', { featured: true, details: ['12 oz speckled stoneware', 'Dipped deep teal glaze, raw clay foot', 'Dishwasher and microwave safe'] }),
  p('alice-mug', 'Alice Coffee First Mug', 'accessories', 1899, 'accessory', 'Alice, winking, with the one piece of advice she gives before breakfast: coffee first.', { details: ['11 oz ceramic', 'Full-color print, deep teal inside and handle', 'Dishwasher and microwave safe'] }),
  p('bill-icons-mug', 'Bill Icons Mug', 'accessories', 1999, 'accessory', 'Every bill in the house, drawn small and scattered in gold and cream over matte deep teal, with the piggy bank in the middle of it all. Gold inside.', { details: ['12 oz ceramic', 'Matte deep teal outside, gold-color glaze inside', 'Hand wash only; not microwave safe'] }),
  p('water-bottle', 'Billix Water Bottle', 'accessories', 2499, 'accessory', 'Insulated stainless bottle.'),
  p('notebook', 'Billix Notebook', 'accessories', 1499, 'accessory', 'Lined notebook for budgets and notes.'),
  p('sticker-pack', 'Billix Sticker Pack', 'accessories', 699, 'accessory', 'Logo and Alice stickers.'),
  p('mouse-pad', 'Billix Mouse Pad', 'accessories', 1499, 'accessory', 'Smooth-surface mouse pad.'),
  p('desk-mat', 'Billix Desk Mat', 'accessories', 2999, 'accessory', 'Full-size desk mat.'),
  p('pen-set', 'Billix Pen Set', 'accessories', 999, 'accessory', 'A set of smooth-writing pens.'),
  p('magnet-pack', 'Billix Magnet Pack', 'accessories', 799, 'accessory', 'Fridge magnets to keep due dates in sight.'),
  p('wall-calendar', 'Billix Wall Calendar', 'accessories', 1799, 'accessory', 'A year of bill reminders and tips.'),
  // More accessories and paper goods
  p('enamel-pin', 'Billix Piggy Enamel Pin', 'accessories', 1199, 'accessory', 'A hard-enamel pin of the Billix piggy bank.'),
  p('bill-organizer-folder', 'Billix Bill Organizer Folder', 'accessories', 1999, 'accessory', 'A 12-pocket expanding folder with a tab for every month.', { details: ['12 labeled pockets', 'Elastic closure', 'Fits letter-size bills'] }),
  p('meter-reading-notepad', 'Meter Reading Notepad', 'workbooks', 899, 'accessory', 'A magnetic tear-off pad that lives on the fridge. Write down your electric, gas and water meter readings each month, so you can check them against your bills.', { details: ['50 tear-off sheets, 5.5 × 8.5 in', 'Magnetic back that holds to the fridge', 'Pencil on a cotton cord included'] }),
  p('bill-day-desk-planner', 'Bill Day Desk Planner', 'workbooks', 2499, 'hardcover', 'An undated desk planner built around due dates: a monthly calendar to mark every bill, and a “Bills this month” page for amounts and what’s paid. Deep teal linen cover with gold foil.', { featured: true, details: ['12 undated months', 'Monthly “Bills this month” pages', 'Linen hardcover, gold foil, gilded edges', 'Lay-flat binding, elastic band, two ribbons'] }),
  // Bundles are hidden (draft) until they are re-planned around the handbook and re-photographed:
  // their photos show books that are no longer sold.
  p('starter-bundle', 'Billix Starter Bundle', 'bundles', 3999, 'bundle', 'The Household Utility Savings Handbook ebook, the bill tracker and a Billix mug, together.', { status: 'draft', details: ['Handbook ebook + printable tracker', 'Billix ceramic mug', 'Gift-ready box'] }),
  p('new-homeowner-gift-set', 'New Homeowner Gift Set', 'bundles', 5999, 'bundle', 'The Household Utility Savings Handbook ebook, the bill organizer folder and a magnet pack.', { status: 'draft' }),
]

/** Drafts are internal planning items and never shown with a price. */
export const visibleProducts = products.filter((x) => x.status !== 'draft')

/** Collections with something to show; one whose items are all drafts (bundles, for now) stays out of the shop. */
export const collections = allCollections.filter((c) => visibleProducts.some((x) => x.collection === c.slug))

export const formatPrice = (cents: number) =>
  cents === 0 ? 'Free' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
