'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { t } from '@/lib/i18n'
import type { Lang } from '@/lib/i18n'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

interface Errors {
  name?: string
  email?: string
  message?: string
}

export default function ContactForm({ lang = 'EN' }: { lang?: Lang }) {
  const tr = t[lang].contact
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  // Honeypot (hidden from users, bots fill it)
  const honeypotRef = useRef<HTMLInputElement>(null)

  // Pre-fill from Hero "Get a free audit" click
  useEffect(() => {
    const handler = (e: Event) => {
      const topic = (e as CustomEvent<string>).detail
      if (topic) setMessage(topic)
    }
    window.addEventListener('prefill-contact', handler)
    return () => window.removeEventListener('prefill-contact', handler)
  }, [])

  const validate = (fields = { name, email, message }): Errors => {
    const e: Errors = {}
    if (!fields.name || fields.name.trim().length < 2) e.name = 'Name must be at least 2 characters'
    if (!fields.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) e.email = 'Enter a valid email'
    if (!fields.message || fields.message.trim().length < 10) e.message = 'Message must be at least 10 characters'
    if (fields.message && fields.message.trim().length > 1000) e.message = 'Message must be under 1000 characters'
    return e
  }

  const handleBlur = (field: string) => {
    setTouched(t => ({ ...t, [field]: true }))
    setErrors(validate())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Honeypot check
    if (honeypotRef.current?.value) return

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setTouched({ name: true, email: true, message: true })
      return
    }

    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-12">
        <p className="text-success text-lg font-medium mb-2">Message sent!</p>
        <p className="text-text-secondary text-sm">
          I'll get back to you within 24 hours. Talk soon.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 max-w-lg">
      {/* Honeypot */}
      <input
        ref={honeypotRef}
        type="text"
        name="website"
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
        className="sr-only"
      />

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm text-text-secondary mb-1.5">{tr.label_name}</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onBlur={() => handleBlur('name')}
          placeholder={tr.ph_name}
          className={[
            'w-full px-4 py-3 rounded-md bg-bg-secondary border text-text-primary placeholder:text-text-disabled text-sm',
            'focus:outline-none focus:border-accent focus:shadow-focus-ring transition-[border-color,box-shadow] duration-150',
            touched.name && errors.name ? 'border-error' : 'border-border-default',
          ].join(' ')}
        />
        {touched.name && errors.name && (
          <p className="text-error text-xs mt-1">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm text-text-secondary mb-1.5">{tr.label_email}</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onBlur={() => handleBlur('email')}
          placeholder={tr.ph_email}
          className={[
            'w-full px-4 py-3 rounded-md bg-bg-secondary border text-text-primary placeholder:text-text-disabled text-sm',
            'focus:outline-none focus:border-accent focus:shadow-focus-ring transition-[border-color,box-shadow] duration-150',
            touched.email && errors.email ? 'border-error' : 'border-border-default',
          ].join(' ')}
        />
        {touched.email && errors.email && (
          <p className="text-error text-xs mt-1">{errors.email}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm text-text-secondary mb-1.5">{tr.label_message}</label>
        <textarea
          id="message"
          rows={5}
          value={message}
          onChange={e => setMessage(e.target.value)}
          onBlur={() => handleBlur('message')}
          placeholder={tr.ph_message}
          className={[
            'w-full px-4 py-3 rounded-md bg-bg-secondary border text-text-primary placeholder:text-text-disabled text-sm resize-none',
            'focus:outline-none focus:border-accent focus:shadow-focus-ring transition-[border-color,box-shadow] duration-150',
            touched.message && errors.message ? 'border-error' : 'border-border-default',
          ].join(' ')}
        />
        {touched.message && errors.message && (
          <p className="text-error text-xs mt-1">{errors.message}</p>
        )}
        <p className="text-text-disabled text-xs mt-1 text-right">{message.length}/1000</p>
      </div>

      {/* Error banner */}
      {status === 'error' && (
        <div className="rounded-md border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          Something went wrong. Try again or reach me directly via{' '}
          <a href="https://t.me/illia_usiuk" className="underline" target="_blank" rel="noopener noreferrer">Telegram</a>
          {' '}or{' '}
          <a href="mailto:illia.usiuk@gmail.com" className="underline">Gmail</a>.
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-accent text-white text-sm font-medium hover:bg-[#5B3EEF] hover:shadow-accent disabled:opacity-60 disabled:cursor-not-allowed transition-[background-color,box-shadow,opacity] duration-150"
      >
        {status === 'sending' ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Sending...
          </>
        ) : (
          tr.submit
        )}
      </button>
    </form>
  )
}
