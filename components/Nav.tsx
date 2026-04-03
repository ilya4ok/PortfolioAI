'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useLang } from '@/components/LangProvider'
import { t } from '@/lib/i18n'

function GithubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
    </svg>
  )
}

export default function Nav() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { lang, setLang } = useLang()
  const tr = t[lang].nav

  const links = [
    { href: '/', label: tr.home },
    { href: '/#cases', label: tr.cases },
    { href: '/about', label: tr.about },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href.replace('/#', '/'))
  }

  const handleContactClick = () => {
    setDrawerOpen(false)
    if (pathname !== '/') {
      window.location.href = '/#contact'
    } else {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <header
        className={[
          'fixed top-0 inset-x-0 z-50 transition-[border-color,background-color] duration-200',
          'bg-bg-primary/80 backdrop-blur-[20px]',
          scrolled ? 'border-b border-border-default' : 'border-b border-transparent',
        ].join(' ')}
      >
        <nav className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className="font-bold text-text-primary text-base tracking-tight hover:opacity-80 transition-opacity duration-150"
          >
            MyAIWay
          </Link>

          {/* Center links — desktop */}
          <ul className="hidden md:flex items-center gap-6">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={[
                    'text-sm transition-colors duration-150 relative pb-0.5',
                    isActive(href)
                      ? 'text-text-primary after:absolute after:bottom-0 after:inset-x-0 after:h-px after:bg-accent'
                      : 'text-text-secondary hover:text-text-primary',
                  ].join(' ')}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side — desktop */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language switcher */}
            <button
              onClick={() => setLang(lang === 'EN' ? 'UA' : 'EN')}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-150 px-1"
              aria-label="Switch language"
            >
              {lang}
            </button>

            {/* GitHub */}
            <a
              href="https://github.com/illia-usiuk"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="text-text-secondary hover:text-text-primary transition-[color,filter] duration-200 hover:[filter:drop-shadow(0_0_7px_rgba(107,78,255,0.6))]"
            >
              <GithubIcon size={18} />
            </a>

            {/* Contact CTA */}
            <button
              onClick={handleContactClick}
              className="px-4 py-2 rounded-md bg-accent text-white text-sm font-medium hover:bg-[#5B3EEF] transition-colors duration-150"
            >
              {tr.contact}
            </button>
          </div>

          {/* Burger — mobile */}
          <button
            className="md:hidden text-text-secondary hover:text-text-primary transition-colors duration-150"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 bg-black"
              onClick={() => setDrawerOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-bg-secondary border-l border-border-default flex flex-col p-6"
            >
              {/* Close */}
              <div className="flex justify-between items-center mb-8">
                <span className="font-bold text-text-primary">MyAIWay</span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="text-text-secondary hover:text-text-primary transition-colors duration-150"
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Links */}
              <ul className="flex flex-col gap-1 flex-1">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setDrawerOpen(false)}
                      className={[
                        'block px-3 py-2.5 rounded-md text-sm transition-colors duration-150',
                        isActive(href)
                          ? 'text-text-primary bg-bg-tertiary'
                          : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary',
                      ].join(' ')}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
                <li>
                  <a
                    href="https://github.com/illia-usiuk"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-md text-sm text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors duration-150"
                  >
                    <GithubIcon size={16} />
                    GitHub
                  </a>
                </li>
              </ul>

              {/* Bottom row */}
              <div className="flex items-center justify-between pt-6 border-t border-border-default">
                <button
                  onClick={() => setLang(lang === 'EN' ? 'UA' : 'EN')}
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-150"
                >
                  {lang}
                </button>
                <button
                  onClick={handleContactClick}
                  className="px-4 py-2 rounded-full bg-accent text-white text-sm font-medium hover:bg-[#5B3EEF] transition-colors duration-150"
                >
                  Contact
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
