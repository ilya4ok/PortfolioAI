'use client'

import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import ContactForm from './ContactForm'
import { useLang } from '@/components/LangProvider'
import { t } from '@/lib/i18n'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0, 0, 0.2, 1] } },
}

export default function ContactSection() {
  const { lang } = useLang()
  const tr = t[lang].contact

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={fadeUp}
          className="mb-10"
        >
          <h2 className="text-text-primary font-semibold text-2xl md:text-3xl">{tr.heading}</h2>
          <p className="text-text-secondary text-sm mt-2 max-w-md">{tr.sub}</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeUp}
        >
          <ContactForm lang={lang} />
        </motion.div>
      </div>
    </section>
  )
}
