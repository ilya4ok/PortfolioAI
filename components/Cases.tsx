'use client'

import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'

import * as LucideIcons from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import { useLang } from '@/components/LangProvider'
import { t } from '@/lib/i18n'

interface ActiveCase {
  slug: string
  title: string
  description: string
  metric: string
  tools: string[]
  icon: string
  status: 'active' | 'locked'
  highlights?: Array<{ value: string; label: string }>
}

interface Props {
  activeCasesEn: ActiveCase[]
  activeCasesUk: ActiveCase[]
}

type IconComponent = React.FC<LucideProps>

function getIcon(name: string): IconComponent {
  return ((LucideIcons as unknown) as Record<string, IconComponent>)[name] ?? LucideIcons.Zap
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0, 0, 0.2, 1] as [number, number, number, number] } },
}

const GROUPS = [
  { key: 'product',       slugs: ['forge'] },
  { key: 'content',       slugs: ['ai-media-content', 'news-digest'] },
  { key: 'communication', slugs: ['email-assistant', 'support-chatbot'] },
  { key: 'knowledge',     slugs: ['rag-chat'] },
] as const

/* ─── Active card ──────────────────────────────────────────────────────────── */
function ActiveCard({ c, featured }: { c: ActiveCase; featured?: boolean }) {
  const IconComp = getIcon(c.icon)

  return (
    <a
      href={`/cases/${c.slug}`}
      className={[
        'group flex flex-col justify-between rounded-md bg-bg-secondary border border-border-default',
        'hover:border-border-active transition-[border-color] duration-200',
        featured ? 'min-h-[260px] p-8' : 'min-h-[220px] p-6',
      ].join(' ')}
    >
      <IconComp size={28} className="text-text-secondary" />

      <div>
        <h3 className="font-semibold text-text-primary text-base mt-4 mb-1">{c.title}</h3>
        <p className="text-text-secondary text-sm line-clamp-2">{c.description}</p>
      </div>

      <div className="mt-4">
        {c.highlights && c.highlights.length > 0 ? (
          <div className={['grid gap-3 mb-4', featured ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2'].join(' ')}>
            {c.highlights.slice(0, featured ? 3 : 2).map((h) => (
              <div key={h.value}>
                <p className={['font-bold text-accent leading-none', featured ? 'text-xl' : 'text-base'].join(' ')}>{h.value}</p>
                <p className="text-text-secondary text-xs mt-1 leading-tight">{h.label}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className={['font-bold text-accent mb-4', featured ? 'text-2xl' : 'text-lg'].join(' ')}>
            {c.metric}
          </p>
        )}
        <div className="flex flex-wrap gap-1.5">
          {c.tools.slice(0, 4).map((tool) => (
            <span key={tool} className="text-xs px-2 py-1 rounded-sm bg-bg-tertiary text-text-secondary border border-border-default">
              {tool}
            </span>
          ))}
        </div>
      </div>
    </a>
  )
}

/* ─── Group label ──────────────────────────────────────────────────────────── */
function GroupLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-xs font-medium tracking-widest uppercase text-text-disabled">{label}</span>
      <div className="flex-1 h-px bg-border-default" />
    </div>
  )
}

/* ─── Cases section ─────────────────────────────────────────────────────────── */
export default function Cases({ activeCasesEn, activeCasesUk }: Props) {
  const { lang } = useLang()
  const tr = t[lang].cases
  const activeCases = lang === 'UA' ? activeCasesUk : activeCasesEn

  const bySlug = Object.fromEntries(activeCases.map(c => [c.slug, c]))

  return (
    <section id="cases" className="py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={fadeUp}
          className="mb-12"
        >
          <h2 className="text-text-primary font-semibold text-2xl md:text-3xl">{tr.heading}</h2>
          <p className="text-text-secondary text-sm mt-2">Real problems. Real automations. Real results.</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } } as Variants}
          className="flex flex-col gap-10"
        >
          {GROUPS.map(({ key, slugs }) => {
            const cases = slugs.map(s => bySlug[s]).filter(Boolean)
            if (cases.length === 0) return null
            const isFeatured = key === 'product'

            return (
              <motion.div key={key} variants={fadeUp}>
                <GroupLabel label={tr.groups[key]} />
                <div className={[
                  'grid gap-5',
                  isFeatured ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2',
                ].join(' ')}>
                  {cases.map(c => (
                    <ActiveCard key={c.slug} c={c} featured={isFeatured} />
                  ))}
                </div>
              </motion.div>
            )
          })}

        </motion.div>
      </div>
    </section>
  )
}
