/**
 * Product photos for the shop, keyed by product slug (see products.ts).
 * Generated with scripts/generate_product_images.py; QC notes in scripts/product-images-log.md.
 */
export const productImages: Record<string, string[]> = {
  // Made from the real cover and PDF pages by handbook/build/shop_images.py (Billix_YouTube repo).
  'household-utility-savings-handbook': ['/shop/household-utility-savings-handbook.webp', '/shop/household-utility-savings-handbook-2.webp', '/shop/household-utility-savings-handbook-3.webp'],
  // The three free printables' photos are made from their real pages by handbook/build/printable_images.py.
  'monthly-bill-tracker': ['/shop/monthly-bill-tracker-printable.webp', '/shop/monthly-bill-tracker-printable-2.webp'],
  'annual-bill-budget-planner': ['/shop/annual-bill-budget-planner.webp'],
  'utility-comparison-worksheet': ['/shop/utility-comparison-worksheet.webp'],
  'home-maintenance-planner': ['/shop/home-maintenance-planner.webp'],
  'first-time-homeowner-checklist': ['/shop/first-time-homeowner-checklist.webp'],
  'moving-utilities-checklist': ['/shop/moving-utilities-checklist-printable.webp', '/shop/moving-utilities-checklist-printable-2.webp'],
  '15-minute-bill-audit': ['/shop/15-minute-bill-audit.webp', '/shop/15-minute-bill-audit-2.webp'],
  'subscription-audit-worksheet': ['/shop/subscription-audit-worksheet.webp'],
  'electricity-usage-log': ['/shop/electricity-usage-log.webp'],
  'home-heating-comparison-kit': ['/shop/home-heating-comparison-kit.webp'],
  'household-planner-bundle': ['/shop/household-planner-bundle.webp'],
  'classic-tee': ['/shop/tee-chenille-black.webp', '/shop/tee-chenille-brown.webp', '/shop/tee-chenille-forest.webp'],
  'little-piggy-tee': ['/shop/tee-little-piggy-oatmeal.webp', '/shop/tee-little-piggy-bone.webp', '/shop/tee-little-piggy-sky.webp'],
  'thread-painted-piggy-tee': ['/shop/tee-thread-painted-oatmeal.webp', '/shop/tee-thread-painted-black.webp', '/shop/tee-thread-painted-dustyblue.webp'],
  'one-line-piggy-tee': ['/shop/tee-one-line-sage.webp', '/shop/tee-one-line-slate.webp', '/shop/tee-one-line-rust.webp'],
  'corduroy-piggy-tee': ['/shop/tee-corduroy-natural.webp', '/shop/tee-corduroy-blush.webp', '/shop/tee-corduroy-sage.webp'],
  'alice-photo-tee': ['/shop/tee-alice-photo-black.webp', '/shop/tee-alice-photo-gray.webp', '/shop/tee-alice-photo-sage.webp'],
  'icon-sleeve-long-sleeve': ['/shop/longsleeve-icons-bone.webp', '/shop/longsleeve-icons-gray.webp', '/shop/longsleeve-icons-dustyblue.webp'],
  'signature-hoodie': ['/shop/hoodie-back-patch-forest.webp', '/shop/hoodie-back-patch-black.webp', '/shop/hoodie-back-patch-brown.webp', '/shop/hoodie-plain-forest.webp', '/shop/hoodie-plain-black.webp', '/shop/hoodie-plain-brown.webp'],
  'pocket-piggy-hoodie': ['/shop/hoodie-pocket-piggy-oatmeal.webp', '/shop/hoodie-pocket-piggy-charcoal.webp', '/shop/hoodie-pocket-piggy-dustyblue.webp'],
  'understand-your-bills-tee': ['/shop/tee-understand-your-bills.webp'],
  'alice-explains-tee': ['/shop/tee-alice-explains.webp'],
  'crewneck': ['/shop/crewneck-off-peak-society.webp'],
  'baseball-cap': ['/shop/cap-kwh.webp'],
  'beanie': ['/shop/beanie-68.webp'],
  'polo': ['/shop/polo-gauge.webp'],
  'youth-tee': ['/shop/youth-tee-energy-detective.webp'],
  'tote-bag': ['/shop/tote-chenille-teal.webp', '/shop/tote-chenille-black.webp', '/shop/tote-chenille-brown.webp'],
  'alice-tote': ['/shop/tote-alice-rust.webp', '/shop/tote-alice-teal.webp', '/shop/tote-alice-black.webp'],
  'ceramic-mug': ['/shop/mug-stoneware.webp', '/shop/mug-stoneware-2.webp'],
  'alice-mug': ['/shop/mug-alice-coffee-first.webp', '/shop/mug-alice-coffee-first-2.webp'],
  'bill-icons-mug': ['/shop/mug-bill-icons.webp', '/shop/mug-bill-icons-2.webp'],
  'water-bottle': ['/shop/water-bottle.webp'],
  'notebook': ['/shop/notebook.webp'],
  'sticker-pack': ['/shop/sticker-pack.webp'],
  'mouse-pad': ['/shop/mouse-pad.webp'],
  'desk-mat': ['/shop/desk-mat.webp'],
  'pen-set': ['/shop/pen-set.webp'],
  'magnet-pack': ['/shop/magnet-pack.webp'],
  'wall-calendar': ['/shop/wall-calendar.webp'],
  'enamel-pin': ['/shop/enamel-pin.webp'],
  'bill-organizer-folder': ['/shop/bill-organizer-folder.webp'],
  'meter-reading-notepad': ['/shop/meter-reading-notepad.webp'],
  'bill-day-desk-planner': ['/shop/bill-day-desk-planner.webp', '/shop/bill-day-desk-planner-2.webp'],
  'starter-bundle': ['/shop/starter-bundle.webp', '/shop/starter-bundle-2.webp'],
  'new-homeowner-gift-set': ['/shop/new-homeowner-gift-set.webp'],
}

/**
 * For products sold in several colors or styles: the photo of each choice, so the gallery and the bag can show the one picked.
 * Keys are the Color, or "Color / Back" when another option changes the look. Size never changes the photo.
 */
export const optionImages: Record<string, Record<string, string>> = {
  'classic-tee': { 'Washed Black': '/shop/tee-chenille-black.webp', 'Chocolate Brown': '/shop/tee-chenille-brown.webp', 'Forest Green': '/shop/tee-chenille-forest.webp' },
  'little-piggy-tee': { 'Oatmeal': '/shop/tee-little-piggy-oatmeal.webp', 'Bone': '/shop/tee-little-piggy-bone.webp', 'Sky Blue': '/shop/tee-little-piggy-sky.webp' },
  'thread-painted-piggy-tee': { 'Oatmeal': '/shop/tee-thread-painted-oatmeal.webp', 'Washed Black': '/shop/tee-thread-painted-black.webp', 'Dusty Blue': '/shop/tee-thread-painted-dustyblue.webp' },
  'one-line-piggy-tee': { 'Sage': '/shop/tee-one-line-sage.webp', 'Slate Blue': '/shop/tee-one-line-slate.webp', 'Rust': '/shop/tee-one-line-rust.webp' },
  'corduroy-piggy-tee': { 'Natural': '/shop/tee-corduroy-natural.webp', 'Blush': '/shop/tee-corduroy-blush.webp', 'Pale Sage': '/shop/tee-corduroy-sage.webp' },
  'signature-hoodie': { 'Forest Green / Chenille patch': '/shop/hoodie-back-patch-forest.webp', 'Washed Black / Chenille patch': '/shop/hoodie-back-patch-black.webp', 'Chocolate Brown / Chenille patch': '/shop/hoodie-back-patch-brown.webp', 'Forest Green / Plain': '/shop/hoodie-plain-forest.webp', 'Washed Black / Plain': '/shop/hoodie-plain-black.webp', 'Chocolate Brown / Plain': '/shop/hoodie-plain-brown.webp' },
  'pocket-piggy-hoodie': { 'Oatmeal': '/shop/hoodie-pocket-piggy-oatmeal.webp', 'Charcoal': '/shop/hoodie-pocket-piggy-charcoal.webp', 'Dusty Blue': '/shop/hoodie-pocket-piggy-dustyblue.webp' },
  'alice-photo-tee': { 'Washed Black': '/shop/tee-alice-photo-black.webp', 'Heather Gray': '/shop/tee-alice-photo-gray.webp', 'Sage': '/shop/tee-alice-photo-sage.webp' },
  'icon-sleeve-long-sleeve': { 'Bone': '/shop/longsleeve-icons-bone.webp', 'Heather Gray': '/shop/longsleeve-icons-gray.webp', 'Dusty Blue': '/shop/longsleeve-icons-dustyblue.webp' },
  'tote-bag': { 'Deep Teal': '/shop/tote-chenille-teal.webp', 'Black': '/shop/tote-chenille-black.webp', 'Chocolate Brown': '/shop/tote-chenille-brown.webp' },
  'alice-tote': { 'Rust': '/shop/tote-alice-rust.webp', 'Deep Teal': '/shop/tote-alice-teal.webp', 'Black': '/shop/tote-alice-black.webp' },
}

/** The photo for a set of chosen options, if the product has one per choice. */
export function imageForOptions(slug: string, options: Record<string, string>): string | undefined {
  const byChoice = optionImages[slug]
  if (!byChoice) return undefined
  const look = Object.entries(options).filter(([name, value]) => name !== 'Size' && value).map(([, value]) => value)
  return byChoice[look.join(' / ')] ?? byChoice[options.Color ?? '']
}
