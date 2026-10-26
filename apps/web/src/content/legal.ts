import type { ArticleSection } from './types'

/**
 * Legal page structure. These are working drafts that describe what the site
 * actually does today. They must be reviewed by a qualified attorney before launch;
 * pages show a visible "draft" notice until `reviewed` is true.
 */
export interface LegalPage {
  slug: string
  title: string
  summary: string
  updated: string
  reviewed: boolean
  sections: ArticleSection[]
}

const U = '2026-10-13'
const p = (text: string) => ({ type: 'p' as const, text })

export const legalPages: LegalPage[] = [
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    summary: 'What we collect, why, and the choices you have.',
    updated: '2026-10-26',
    reviewed: false,
    sections: [
      { id: 'collect', heading: 'What we collect', blocks: [
        { type: 'list', items: [
          '**Newsletter and waitlists:** your email address, the topics you choose, when and where you signed up, and a record of your consent.',
          '**Contact form:** your name, email, topic and message.',
          '**Community submissions:** your question or idea, the bill type, and optionally your state, first name and email.',
          '**Bill of the Month:** your first name, state and email, where you heard about it (optional) and your permission choices. If you choose to send a bill for a breakdown, also the photo or PDF (with your personal details covered), its type and your note. We also count visits to the entry page by round and campaign link, using the same salted IP hash, with no cookies. Uploads are stored privately, used only to run the promotion, and deleted within 90 days after the round closes unless the entry wins. We may also ask, optionally, where you heard about the promotion. If you win, we also ask for the details needed to pay the company on your bill.',
          '**Shop orders:** your name, email, shipping address (for physical items) and what you bought. Payments are handled by Stripe; Billix never sees or stores your full card number.',
          '**Security data:** a one-way, salted hash of your IP address, used to prevent spam and abuse. We don’t store the IP address itself.',
        ] },
        p('**Calculators** run in your browser. What you type into them is not sent to or stored by Billix.'),
      ] },
      { id: 'use', heading: 'How we use it', blocks: [
        { type: 'list', items: ['To send the emails you asked for, and only those.', 'To reply to your messages.', 'To decide which guides and videos to make.', 'To keep the site secure and stop spam.'] },
        p('We don’t sell or rent personal information, and we don’t use it for advertising.'),
      ] },
      { id: 'cookies', heading: 'Cookies and tracking', blocks: [
        p('The site currently sets no advertising or analytics cookies. If that changes, we’ll update this policy and the [cookie settings](/legal/cookies) page first, and ask for consent where required. Published videos are embedded using YouTube’s privacy-enhanced mode.'),
      ] },
      { id: 'sharing', heading: 'Service providers', blocks: [
        p('We use hosting, database and email-delivery providers to run Billix. Shop payments are processed by Stripe under its own privacy policy. Providers process data only on our instructions. This section will list them all by name before launch.'),
      ] },
      { id: 'choices', heading: 'Your choices', blocks: [
        p('Unsubscribe or change topics from any newsletter email. To access, correct or delete your information, email [info@billixapp.com](mailto:info@billixapp.com). Billix is not intended for children under 13 and doesn’t knowingly collect their information.'),
      ] },
      { id: 'contact', heading: 'Contact', blocks: [p('Questions about privacy: [info@billixapp.com](mailto:info@billixapp.com).')] },
    ],
  },
  {
    slug: 'terms',
    title: 'Terms of Use',
    summary: 'The rules for using the Billix website.',
    updated: U,
    reviewed: false,
    sections: [
      { id: 'education', heading: 'Educational information only', blocks: [p('Billix provides general educational information about household bills. It is not financial, legal, tax, insurance or medical advice. Rates, rules and programs vary by provider and location and change over time. Check important decisions with your provider or a qualified professional.')] },
      { id: 'calculators', heading: 'Calculators', blocks: [p('Calculator results are estimates based on the numbers you enter and the assumptions shown on each tool. Actual bills may differ.')] },
      { id: 'content', heading: 'Our content', blocks: [p('Billix text, illustrations, the Alice character and the Billix logo belong to Billix. You may link to and share our pages. Please don’t copy whole guides or alter our artwork without permission.')] },
      { id: 'submissions', heading: 'Your submissions', blocks: [p('When you send a question or idea, you let Billix use it to create educational content. We won’t publish your name or email. Submissions must follow our [community guidelines](/community/guidelines).')] },
      { id: 'changes', heading: 'Changes', blocks: [p('We may update these terms. The date at the top shows the latest version.')] },
    ],
  },
  {
    slug: 'cookies',
    title: 'Cookie Settings',
    summary: 'Which cookies Billix uses and how to control them.',
    updated: U,
    reviewed: false,
    sections: [
      { id: 'now', heading: 'Cookies we use today', blocks: [p('None for advertising or analytics. The site works without cookies. Your browser may store small preferences locally (for example, what you typed into a form you haven’t sent yet).')] },
      { id: 'later', heading: 'If that changes', blocks: [p('Before adding analytics or other optional cookies, we’ll add a consent control to this page so you can turn them on or off, and update the [privacy policy](/legal/privacy).')] },
    ],
  },
  {
    slug: 'affiliate-disclosure',
    title: 'Affiliate Disclosure',
    summary: 'How Billix is paid, and how that’s labeled.',
    updated: U,
    reviewed: false,
    sections: [
      { id: 'now', heading: 'Today', blocks: [p('Billix has no affiliate links or sponsorships. No company pays us to appear in our guides, videos or tools.')] },
      { id: 'future', heading: 'In the future', blocks: [p('If we ever earn a commission or sponsorship, the link or content will be clearly labeled where it appears, it won’t change what we say about a product or provider, and this page will list the relationship.')] },
    ],
  },
  {
    slug: 'accessibility',
    title: 'Accessibility',
    summary: 'Our commitment to an accessible Billix.',
    updated: U,
    reviewed: false,
    sections: [
      { id: 'goal', heading: 'Our goal', blocks: [p('We aim to meet WCAG 2.2 Level AA. The site supports keyboard navigation, screen readers, reduced motion, and text that scales with your browser settings. Videos will include captions and transcripts.')] },
      { id: 'feedback', heading: 'Tell us about barriers', blocks: [p('If something is hard to use, [contact us](/contact?topic=support) and describe the page and the problem. We’ll respond within two business days.')] },
    ],
  },
  {
    slug: 'shipping',
    title: 'Shipping Policy',
    summary: 'Shipping details for physical products.',
    updated: '2026-10-26',
    reviewed: false,
    sections: [
      { id: 'made-to-order', heading: 'Made to order', blocks: [p('Billix clothing, mugs and totes are made to order. We place each production run once orders come in, so physical items usually ship about 4 to 6 weeks after you order. The product page and checkout show this before you pay.')] },
      { id: 'where', heading: 'Where we ship', blocks: [p('We ship to addresses in the United States only.')] },
      { id: 'cost', heading: 'What shipping costs', blocks: [p('Shipping is a flat $6.95 per order. Orders whose physical items total $75 or more ship free. Ebooks and other downloads never have a shipping charge.')] },
      { id: 'delays', heading: 'If we can’t ship on time', blocks: [p('If your order can’t ship within the time we gave you, we’ll email you with a new date before that time runs out. You can then cancel for a full refund, or keep the order.')] },
      { id: 'tracking', heading: 'Tracking', blocks: [p('We email you when your order ships, with tracking when the carrier provides it. Questions about an order? [Contact us](/contact?topic=support).')] },
    ],
  },
  {
    slug: 'returns',
    title: 'Returns & Refunds',
    summary: 'All sales are final.',
    updated: '2026-10-26',
    reviewed: false,
    sections: [
      { id: 'final', heading: 'All sales are final', blocks: [p('We don’t accept returns or exchanges, and we don’t give refunds for a change of mind, on any item: ebooks, clothing, mugs and totes. Please check sizes, colors and options before you order.')] },
      { id: 'damaged', heading: 'Damaged or wrong items', blocks: [p('If something arrives damaged or isn’t what you ordered, [contact us](/contact?topic=support) within 30 days of delivery with a photo and we’ll send a replacement at no cost to you.')] },
      { id: 'late', heading: 'If we can’t ship on time', blocks: [p('Made-to-order items usually ship in about 4 to 6 weeks. If your order can’t ship within the time we gave you, we’ll email you before that time runs out, and you can cancel for a full refund or wait for the new date.')] },
      { id: 'how', heading: 'How refunds are paid', blocks: [p('When a refund applies, it goes back to the card or payment method you used, through Stripe. Your bank may take 5 to 10 business days to show it.')] },
    ],
  },
  {
    slug: 'digital-product-terms',
    title: 'Digital Product Terms',
    summary: 'Terms for ebooks and downloads.',
    updated: '2026-10-26',
    reviewed: false,
    sections: [
      { id: 'delivery', heading: 'How you get your ebook', blocks: [p('After checkout you can download the PDF straight from your order page. We also email you the download link. The link keeps working, so you can download the book again later.')] },
      { id: 'license', heading: 'What you can do with it', blocks: [p('Your purchase is for you and your household. You can print it, keep copies on your own devices and share it with people you live with. Please don’t post it online, resell it or share the file outside your household.')] },
      { id: 'updates', heading: 'Updates', blocks: [p('When we publish corrections to the edition you bought, your download link gives you the updated file.')] },
      { id: 'refunds', heading: 'Refunds', blocks: [p('All ebook sales are final. If your download doesn’t work, [contact us](/contact?topic=support) and we’ll fix it. See [Returns & Refunds](/legal/returns).')] },
    ],
  },
  {
    slug: 'bill-of-the-month-rules',
    title: 'Bill of the Month: Official Rules',
    summary: 'The rules for the Billix Bill of the Month promotion.',
    updated: U,
    reviewed: false,
    sections: [
      { id: 'no-purchase', heading: 'No purchase necessary', blocks: [
        p('**NO PURCHASE, PAYMENT OR SUBSCRIPTION IS NECESSARY TO ENTER OR WIN.** A purchase, subscription, follow, like or comment does not improve your chances of winning. Void where prohibited.'),
      ] },
      { id: 'sponsor', heading: '1. Sponsor', blocks: [
        p('The sponsor is Billix LLC, a Michigan limited liability company (“Billix”). Questions: [info@billixapp.com](mailto:info@billixapp.com). This promotion is not sponsored, endorsed or administered by, or associated with, YouTube, Google or TikTok. By entering, you release them from any liability related to it.'),
      ] },
      { id: 'eligibility', heading: '2. Who can enter', blocks: [
        p('Legal residents of the 50 United States and the District of Columbia who are 18 or older and responsible for, or living in a household with, an eligible household bill (see section 6). Employees and contractors of Billix and their immediate families and households can’t enter.'),
      ] },
      { id: 'periods', heading: '3. Promotion periods', blocks: [
        p('The promotion runs in separate rounds (each a “Period”). Each Period starts at 12:00 a.m. Eastern Time on the 16th of a month and ends at 11:59 p.m. Eastern Time on the 15th of the next month. The first Period starts when entries open on this site, no earlier than October 13, 2026, and ends at 11:59 p.m. Eastern Time on November 15, 2026; the next runs November 16 through December 15, 2026, and so on. Each Period is a separate promotion with its own prize. Billix may end future Periods at any time by posting a notice here; that won’t affect a Period already open.'),
      ] },
      { id: 'enter', heading: '4. How to enter', blocks: [
        p('Complete the form at [billixapp.com/bill-of-the-month](/bill-of-the-month) during a Period with your first name, state and email, choose “Enter this round’s $50 drawing”, and confirm you meet these rules. **That’s all that’s needed to enter.** No bill, upload, purchase, subscription, follow, like or comment is required, and none of them improves your chances.'),
        p('Limit one entry per person (and per email address) per Period; additional entries are void. Entries must follow the [YouTube Community Guidelines](https://www.youtube.com/howyoutubeworks/policies/community-guidelines/); entries that don’t comply with them or with these rules will be disqualified.'),
      ] },
      { id: 'breakdowns', heading: '5. Optional bill breakdowns (separate from the drawing)', blocks: [
        p('Separately, you may send a photo or PDF of a household bill for Billix to consider explaining in its videos. This is a request for educational content, **not an entry**, and it has no effect on the drawing: an entry with a bill and an entry without one have exactly the same chance of winning. You can send a bill with or without entering the drawing.'),
        p('Before sending, cover your name, street address, account number, meter or service ID, QR codes, barcodes, phone number and any payment details. Billix may choose submitted bills to explain (“Featured Bills”) only from people who checked the separate box giving permission to show them (see section 8).'),
      ] },
      { id: 'selection', heading: '6. Winner selection and prize', blocks: [
        p('Within 7 days after each Period ends, Billix will randomly select one winner from all eligible drawing entries received during that Period, using a computer-generated random draw that is recorded. Odds of winning depend on the number of eligible entries. The winner is chosen only by this draw; whether a bill was sent or featured plays no part.'),
        p('**Prize (one per Period): $50.** Billix pays $50 directly to the company that issues a household bill the winner chooses (electric, natural gas, heating oil, propane, water/sewer, trash/recycling, internet, phone/mobile, or cable/satellite TV), credited to the winner’s account. If the winner owes more than $50, the rest remains the winner’s responsibility. If the winner owes less than $50, the rest stays as a credit on the account where the company allows it. If Billix can’t pay the company directly, the winner receives a $50 prepaid card instead. Approximate retail value: $50. No cash alternative, and the prize can’t be transferred. The winner is responsible for any taxes.'),
      ] },
      { id: 'notification', heading: '7. Notification', blocks: [
        p('The winner is notified by email, so following any Billix channel is not needed to win. The winner has 7 days to reply and may be asked to confirm eligibility in writing. If the winner doesn’t reply in time or isn’t eligible, the prize is forfeited and an alternate winner may be drawn. Billix will never ask for a password, card number or any payment. Account details needed to make the payment are collected only from the winner, privately.'),
      ] },
      { id: 'your-bill', heading: '8. Your bill and your permission', blocks: [
        p('You keep ownership of anything you submit. Uploading a bill only lets Billix review it to run this promotion. Billix will show a bill you send in its videos, posts or website only if you check the separate permission box. That permission covers showing the bill with personal details covered, in Billix content about bills, and you can withdraw it for future content at any time by emailing [info@billixapp.com](mailto:info@billixapp.com). Billix will cover any personal details you missed before showing a bill.'),
      ] },
      { id: 'privacy', heading: '9. Privacy notice and publicity', blocks: [
        p('**What we collect:** your first name, state and email; where you heard about us (optional); your permission choices; and, only if you send a bill for a breakdown, the bill file, its type and your note; and a salted hash of your IP address for security. From the winner only, we also collect the account details needed to pay the bill.'),
        p('**How we use it:** to run the promotion (checking eligibility, the draw, notifying and paying the winner), to choose Featured Bills from entrants who gave permission, and to count entries and visits in aggregate. We don’t sell it, use it for advertising or add you to any mailing list. It’s stored with our hosting, database and email providers, which process it only on our instructions.'),
        p('Billix will never publish an entrant’s full name, address, account number or other identifying details. Featured Bills are shown with personal details covered, and credited by first name and state only if the entrant agreed. The winner is announced by first name and state only, with permission. Entries and bills are used only to run this promotion and are handled as described in our [Privacy Policy](/legal/privacy); entries that don’t win, and bills not used in a video, are deleted within 90 days after the Period ends.'),
      ] },
      { id: 'general', heading: '10. General', blocks: [
        p('Billix may disqualify entries that are fraudulent, altered or don’t follow these rules, and isn’t responsible for lost, late, incomplete or misdirected entries or for technical failures. These rules are governed by the laws of the State of Michigan. For the winner’s first name and state for a Period, email [info@billixapp.com](mailto:info@billixapp.com) within 60 days after it ends.'),
      ] },
    ],
  },
]

export const getLegalPage = (slug: string) => legalPages.find((p) => p.slug === slug)
