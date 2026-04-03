'use client'

import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'

import * as LucideIcons from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import { casesPreview } from '@/config/cases-preview'
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
}

interface Props {
  activeCases: ActiveCase[]
}

type IconComponent = React.FC<LucideProps>

function getIcon(name: string): IconComponent {
  return ((LucideIcons as unknown) as Record<string, IconComponent>)[name] ?? LucideIcons.Zap
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0, 0, 0.2, 1] as [number, number, number, number] } },
}

/* ─── Active card ──────────────────────────────────────────────────────────── */
function ActiveCard({ c, featured }: { c: ActiveCase; featured?: boolean }) {
  const IconComp = getIcon(c.icon)

  return (
    <a
      href={`/cases/${c.slug}`}
      className={[
        'group flex flex-col justify-between rounded-md bg-bg-secondary border border-border-default',
        'hover:border-border-active transition-[border-color] duration-200',
        featured ? 'col-span-full min-h-[280px] p-8' : 'min-h-[220px] p-6',
      ].join(' ')}
    >
      <IconComp size={28} className="text-text-secondary" />

      <div>
        <h3 className="font-semibold text-text-primary text-base mt-4 mb-1">{c.title}</h3>
        <p className="text-text-secondary text-sm line-clamp-2">{c.description}</p>
      </div>

      <div className="mt-4">
        <p className={['font-bold text-accent', featured ? 'text-2xl' : 'text-lg'].join(' ')}>
          {c.metric}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {c.tools.slice(0, 4).map((t) => (
            <span key={t} className="text-xs px-2 py-1 rounded-sm bg-bg-tertiary text-text-secondary border border-border-default">
              {t}
            </span>
          ))}
        </div>
      </div>
    </a>
  )
}

/* ─── In-progress card ─────────────────────────────────────────────────────── */
function InProgressCard({ item }: { item: (typeof casesPreview)[number] }) {
  const IconComp = getIcon(item.icon)
  const { lang } = useLang()
  const coming = t[lang].cases.coming

  return (
    <div className="flex flex-col justify-between rounded-md bg-bg-secondary border border-border-default min-h-[220px] p-6 opacity-40 select-none">
      <IconComp size={28} className="text-text-disabled" />
      <div>
        <h3 className="font-semibold text-text-secondary text-base mt-4 mb-1">{item.title}</h3>
        <p className="text-text-disabled text-sm">{coming} {item.comingSoon}</p>
      </div>
    </div>
  )
}

/* ─── Cases section ─────────────────────────────────────────────────────────── */
export default function Cases({ activeCases }: Props) {
  const previews = casesPreview.slice(0, 3)
  const { lang } = useLang()
  const tr = t[lang].cases

  return (
    <section id="cases" className="py-24 px-6">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={fadeUp}
          className="mb-10"
        >
          <h2 className="text-text-primary font-semibold text-2xl md:text-3xl">{tr.heading}</h2>
          <p className="text-text-secondary text-sm mt-2">Real problems. Real automations. Real results.</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } } as Variants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {activeCases.map((c, i) => (
            <motion.div key={c.slug} variants={fadeUp} className={i === 0 ? 'lg:col-span-3' : ''}>
              <ActiveCard c={c} featured={i === 0} />
            </motion.div>
          ))}

          {previews.map((item) => (
            <motion.div key={item.title} variants={fadeUp}>
              <InProgressCard item={item} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
