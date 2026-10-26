import type { Metadata } from 'next'
import Link from 'next/link'
import { AliceFace, AliceNote } from '@/components/brand/alice'
import { AliceMoods } from '@/components/brand/alice-moods'
import { ButtonLink, Section } from '@/components/ui/primitives'
import { getVideos } from '@/lib/content'
import { VideoCard } from '@/components/content/cards'

export const metadata: Metadata = {
  title: 'Meet Alice',
  description: 'Alice is the illustrated narrator of Billix. She reads bills line by line and explains them in plain English.',
  alternates: { canonical: '/meet-alice' },
}

export default function MeetAlicePage() {
  const videos = getVideos().filter((v) => v.kind === 'video').slice(0, 3)
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="container-x relative grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1fr_auto]">
          <div className="max-w-2xl">
            <h1 className="text-[clamp(3rem,7vw,5.4rem)] font-extrabold leading-[0.95] tracking-[-0.045em] text-teal-deep">Hi, I&rsquo;m Alice.</h1>
            <p className="mt-6 text-xl leading-relaxed text-muted">I&rsquo;m the narrator of Billix. I sit down with the bills nobody explains, read them line by line, and tell you what each charge means, why it changes, and what you can check.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/videos" arrow>Watch my videos</ButtonLink>
              <ButtonLink href="/ask-alice" variant="ghost">About Ask Alice</ButtonLink>
            </div>
          </div>
          <AliceFace mood="hello" priority size={400} className="mx-auto" />
        </div>
      </section>
      <Section tone="paper">
        <div className="max-w-3xl">
          <div className="prose-billix space-y-4">
            <h2 className="text-3xl font-extrabold text-teal-deep">What Alice does</h2>
            <p>Alice explains household bills in Billix videos, guides and tools. She&rsquo;s curious, patient and a little bit stubborn about getting to the bottom of a confusing charge.</p>
            <p>She&rsquo;s an illustrated character. In videos, her voice is AI-generated and her scripts are researched and fact-checked by the Billix team, with sources listed for every video. Read more in our <Link href="/editorial-standards">editorial standards</Link>.</p>
            <AliceNote>I&rsquo;ll never tell you what to do with your money. I&rsquo;ll show you how the bill works so you can decide.</AliceNote>
          </div>
        </div>
      </Section>
      <Section>
        <h2 className="text-[clamp(1.9rem,3.8vw,2.9rem)] font-extrabold text-teal-deep">Alice has a look for every bill</h2>
        <p className="mt-3 max-w-2xl text-lg text-muted">Hover or tap to see her up close.</p>
        <div className="mt-10"><AliceMoods /></div>
      </Section>
      <Section tone="paper">
        <h2 className="text-3xl font-extrabold text-teal-deep">Watch Alice explain</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">{videos.map((v) => <VideoCard key={v.slug} v={v} />)}</div>
        <p className="mt-8 text-muted">You can also find Alice on a mug, a tee and a tote in the <Link href="/shop" className="font-semibold text-teal-ink underline">Billix shop</Link>.</p>
      </Section>
    </>
  )
}
