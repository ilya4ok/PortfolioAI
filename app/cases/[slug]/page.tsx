import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { compileMDX } from 'next-mdx-remote/rsc'
import { getCaseBySlug, getActiveSlugs, estimateReadTime } from '@/lib/cases'
import Link from 'next/link'
import { ArrowLeft, BookOpen, CalendarDays, Trophy, Brain, Zap, Star, Target, Layers, Users, Database, Clock, MessageSquare, Search, Repeat, MessageCircle, Sparkles, Mail, Send, CheckCircle, RefreshCw, Globe, Shield, type LucideIcon } from 'lucide-react'
import ScrollProgress from '@/components/ScrollProgress'
import { cookies } from 'next/headers'

const ICON_MAP: Record<string, LucideIcon> = {
  BookOpen, CalendarDays, Trophy, Brain, Zap, Star, Target, Layers,
  Users, Database, Clock, MessageSquare, Search, Repeat, MessageCircle, Sparkles,
  Mail, Send, CheckCircle, RefreshCw, Globe, Shield,
}

interface Params { slug: string }

export async function generateStaticParams() {
  return getActiveSlugs().map(slug => ({ slug }))
}

export const dynamic = 'force-dynamic'

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await params
  const data = getCaseBySlug(slug)
  if (!data) return {}
  const { frontmatter: c } = data
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  return {
    title: `${c.title} — MyAIWay`,
    description: c.description,
    openGraph: { title: c.title, description: c.description, url: `${siteUrl}/cases/${slug}` },
  }
}

export default async function CasePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params

  const cookieStore = await cookies()
  const langCookie = cookieStore.get('lang')?.value
  const locale: 'en' | 'uk' = langCookie === 'UA' ? 'uk' : 'en'

  const isUK = locale === 'uk'

  const data = getCaseBySlug(slug, locale)
  if (!data || data.frontmatter.status !== 'active') notFound()

  const { frontmatter: c, content } = data
  const readTime = estimateReadTime(content)

  const hasSections = c.sections && c.sections.length > 0

  const mdxContent = hasSections ? null : await compileMDX({
    source: content,
    options: { parseFrontmatter: false },
  }).then(r => r.content)

  const ui = {
    back: isUK ? '← Всі кейси' : '← All cases',
    about: isUK ? 'Про цей кейс' : 'About this case',
    stack: isUK ? 'Стек' : 'Stack',
    read: isUK ? 'хв читання' : 'min read',
    cta: isUK ? 'Схожа задача?' : 'Got a similar problem?',
  }

  return (
    <>
      <ScrollProgress />
      <main className="max-w-[1400px] mx-auto px-6 pt-24 pb-24">

        <Link
          href="/#cases"
          className="inline-flex items-center gap-1.5 text-text-secondary text-sm hover:text-text-primary transition-colors duration-150 mb-10"
        >
          <ArrowLeft size={14} />
          {ui.back}
        </Link>

        <div className="grid lg:grid-cols-[1fr_280px] gap-8 lg:gap-16 items-start">

          {/* ── Left: prose ── */}
          <article className="min-w-0">
            {/* Header: logo + title */}
            <div className="flex items-center gap-4 mb-3">
              {c.logo && (
                <img src={c.logo} alt={c.title} width={52} height={52} className="rounded-xl flex-shrink-0" />
              )}
              <h1 className="font-bold text-text-primary text-3xl md:text-4xl">{c.title}</h1>
            </div>
            <p className="text-accent font-bold text-2xl md:text-3xl mb-8">{c.metric}</p>

            {/* Highlights row */}
            {c.highlights && c.highlights.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
                {c.highlights.map((h, i) => (
                  <div key={i} className="rounded-md bg-bg-secondary border border-border-default p-4 text-center sm:text-center flex sm:flex-col items-center sm:items-center gap-3 sm:gap-0">
                    <p className="text-accent font-bold text-xl md:text-2xl leading-tight">{h.value}</p>
                    <p className="text-text-disabled text-xs sm:mt-1 leading-snug">{h.label}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Sections (card-driven narrative) */}
            {hasSections ? (
              <div className="flex flex-col gap-10">
                {c.sections!.map((section, si) => (
                  <div key={si}>
                    {section.type !== 'callout' && (
                      <h2 className="text-text-primary font-semibold text-lg mb-4">{section.title}</h2>
                    )}

                    {/* text */}
                    {section.type === 'text' && (
                      <div className="rounded-md bg-bg-secondary border border-border-default p-5">
                        <p className="text-text-secondary text-sm leading-relaxed">{section.body}</p>
                      </div>
                    )}

                    {/* cards */}
                    {section.type === 'cards' && (
                      <div className="grid sm:grid-cols-2 gap-3">
                        {section.items?.map((item, ii) => {
                          const Icon = ICON_MAP[item.icon] ?? Zap
                          return (
                            <div key={ii} className="rounded-md bg-bg-secondary border border-border-default p-5 flex gap-4 items-start">
                              <div className="flex-shrink-0 w-9 h-9 rounded-md bg-accent/10 flex items-center justify-center">
                                <Icon size={18} className="text-accent" />
                              </div>
                              <div>
                                <p className="text-text-primary font-semibold text-sm mb-1">{item.title}</p>
                                <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* process timeline — vertical */}
                    {section.type === 'process' && section.steps && (
                      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-0">
                        {section.steps.map((step, idx) => {
                          const isLast = idx === section.steps!.length - 1
                          const isBefore = step.step === 0
                          return (
                            <div key={idx} className="flex gap-3">
                              {/* left: circle + line */}
                              <div className="flex flex-col items-center flex-shrink-0">
                                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 ${isBefore ? 'border-text-disabled text-text-disabled' : 'border-accent text-accent'}`}>
                                  {step.step}
                                </div>
                                {!isLast && (
                                  <div className="w-px flex-1 min-h-[24px] border-l border-dashed border-border-default my-1" />
                                )}
                              </div>
                              {/* right: content */}
                              <div className={`pb-6 ${isLast ? 'pb-0' : ''}`}>
                                <p className={`font-semibold text-sm leading-tight mb-1 ${isBefore ? 'text-text-disabled' : 'text-text-primary'}`}>{step.label}</p>
                                <p className="text-text-disabled text-sm leading-relaxed">{step.desc}</p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* split: screenshot + numbered steps side by side */}
                    {section.type === 'split' && section.steps && (
                      <div className="grid md:grid-cols-2 gap-5 items-start">
                        <div className="flex flex-col gap-2.5">
                          {section.steps.map((step, idx) => (
                            <div key={idx} className="rounded-md bg-bg-secondary border border-border-default p-3.5 flex gap-3 items-start">
                              <div className="w-6 h-6 rounded-full border-2 border-accent text-accent flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                {step.step}
                              </div>
                              <div>
                                <p className="text-text-primary font-semibold text-sm leading-tight">{step.label}</p>
                                <p className="text-text-disabled text-xs mt-0.5 leading-snug">{step.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        {section.screenshot && (
                          <div className="rounded-lg overflow-hidden border border-border-default">
                            <img src={section.screenshot} alt={section.title} className="w-full h-auto block" />
                          </div>
                        )}
                      </div>
                    )}

                    {/* screenshot (non-split, non-callout sections) */}
                    {section.screenshot && section.type !== 'split' && section.type !== 'callout' && (
                      <div className="mt-4 rounded-lg overflow-hidden border border-border-default">
                        <img
                          src={section.screenshot}
                          alt={section.title}
                          className="w-full h-auto block"
                        />
                      </div>
                    )}

                    {/* callout */}
                    {section.type === 'callout' && (
                      <div className="rounded-md border border-accent/30 bg-accent/5 overflow-hidden">
                        {section.screenshot && (
                          <img src={section.screenshot} alt={section.title} className="w-full h-auto block" />
                        )}
                        <div className="p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex-1">
                            <p className="text-text-primary font-semibold text-base mb-1">{section.title}</p>
                            <p className="text-text-secondary text-sm leading-relaxed">{section.body}</p>
                          </div>
                          {section.cta && (
                            <a
                              href={section.cta_href ?? '/#contact'}
                              {...(section.cta_href ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                              className="inline-flex items-center justify-center h-10 px-5 rounded-md bg-accent text-white text-sm font-medium hover:bg-[#5B3EEF] transition-colors duration-200 flex-shrink-0"
                            >
                              {section.cta}
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="prose prose-invert prose-sm max-w-none
                [&_h2]:text-text-primary [&_h2]:font-semibold [&_h2]:text-xl [&_h2]:mt-10 [&_h2]:mb-4
                [&_h3]:text-text-primary [&_h3]:font-semibold [&_h3]:text-base [&_h3]:mt-8 [&_h3]:mb-3
                [&_p]:text-text-secondary [&_p]:leading-relaxed [&_p]:mb-4
                [&_li]:text-text-secondary [&_li]:leading-relaxed
                [&_strong]:text-text-primary
                [&_a]:text-accent-blue [&_a]:underline [&_a]:underline-offset-2
                [&_code]:text-accent-cyan [&_code]:bg-bg-tertiary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-sm [&_code]:text-xs
                [&_pre]:bg-bg-secondary [&_pre]:border [&_pre]:border-border-default [&_pre]:rounded-md [&_pre]:p-4 [&_pre]:overflow-x-auto
                [&_blockquote]:border-l-2 [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:text-text-secondary
              ">
                {mdxContent}
              </div>
            )}

            {/* Features grid */}
            {c.features && c.features.length > 0 && (
              <div className="mt-12 grid sm:grid-cols-2 gap-3">
                {c.features.map((f, i) => {
                  const Icon = ICON_MAP[f.icon] ?? Zap
                  return (
                    <div key={i} className="rounded-md bg-bg-secondary border border-border-default p-5 flex gap-4 items-start">
                      <div className="flex-shrink-0 w-9 h-9 rounded-md bg-accent/10 flex items-center justify-center">
                        <Icon size={18} className="text-accent" />
                      </div>
                      <div>
                        <p className="text-text-primary font-semibold text-sm mb-1">{f.title}</p>
                        <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </article>

          {/* ── Right: sticky sidebar ── */}
          <aside className="order-first lg:order-last lg:sticky lg:top-28 flex flex-col gap-4">

            {/* On mobile: compact inline row — stack + read time */}
            <div className="rounded-md bg-bg-secondary border border-border-default p-4 lg:p-5">
              <div className="flex items-start justify-between gap-4 lg:block">
                <div className="lg:mb-4 min-w-0">
                  <p className="text-text-disabled text-xs uppercase tracking-wider mb-2">{ui.stack}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {c.tools.map(tool => (
                      <span key={tool} className="text-xs px-2 py-0.5 rounded-sm bg-bg-tertiary text-text-secondary border border-border-default">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-text-disabled text-xs whitespace-nowrap flex-shrink-0 pt-0.5 lg:hidden">{readTime} {ui.read}</p>
              </div>
            </div>

            {/* Description — hidden on mobile, visible on lg */}
            <div className="hidden lg:block rounded-md bg-bg-secondary border border-border-default p-5">
              <p className="text-text-disabled text-xs uppercase tracking-wider mb-3">{ui.about}</p>
              <p className="text-text-secondary text-sm leading-relaxed mb-4">{c.description}</p>
              <p className="text-text-disabled text-sm">{readTime} {ui.read}</p>
            </div>

            <a
              href="/#contact"
              className="inline-flex items-center justify-center h-11 px-6 rounded-md bg-accent text-white text-sm font-medium hover:bg-[#5B3EEF] transition-colors duration-200"
            >
              {ui.cta}
            </a>
          </aside>
        </div>
      </main>
    </>
  )
}
