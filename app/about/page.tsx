'use client'

import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import CustomCursor from '@/components/CustomCursor'
import { ExternalLink } from 'lucide-react'
import { useLang } from '@/components/LangProvider'
import { t } from '@/lib/i18n'

const skills = {
  'Automation': ['Make', 'Zapier', 'n8n', 'API integrations (no-code)', 'Webhooks', 'JSON'],
  'AI / LLM': ['ChatGPT API', 'Claude API', 'Gemini', 'Prompt engineering', 'AI agents via n8n/Make'],
  'Design': ['Figma', 'UX Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Accessibility'],
  'Data': ['Google Sheets', 'Airtable', 'CSV', 'Power BI', 'Process analytics'],
  'Marketing': ['SEO', 'GEO (Generative Engine Optimization)', 'Email automation', 'HubSpot', 'AI-assisted content'],
  'Approach': ['Systems thinking', 'Workflow design', 'MVP validation', 'Full cycle: discovery → production'],
}

export default function AboutPage() {
  const { lang } = useLang()
  const tr = t[lang].about

  return (
    <>
      <CustomCursor />
      <Nav />
      <main className="max-w-[1400px] mx-auto px-6 pt-24 pb-24">

        <div className="grid lg:grid-cols-[1fr_360px] gap-12 lg:gap-16 items-start">

          {/* ── Left: story + principles ── */}
          <div>
            <p className="text-accent text-xs font-medium tracking-widest uppercase mb-4">{tr.label}</p>
            <h1 className="font-bold text-text-primary text-3xl md:text-4xl mb-8">{tr.heading}</h1>

            <p className="text-text-secondary leading-relaxed mb-10">{tr.intro}</p>

            <section className="mb-10">
              <h2 className="font-semibold text-text-primary text-xl mb-4">{tr.what_heading}</h2>
              <p className="text-text-secondary leading-relaxed">{tr.what_body}</p>
            </section>

            <div className="mb-10">
              <a
                href="https://drive.google.com/drive/folders/YOUR_CV_FOLDER_ID"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-border-active text-text-primary text-sm font-medium hover:bg-bg-tertiary transition-colors duration-150"
              >
                {tr.cv}
                <ExternalLink size={14} />
              </a>
            </div>

            <section className="mb-10">
              <h2 className="font-semibold text-text-primary text-xl mb-6">{tr.how_heading}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {tr.principles.map(({ title, body }) => (
                  <div key={title} className="rounded-md bg-bg-secondary border border-border-default p-5">
                    <p className="text-text-primary font-medium text-sm mb-2">{title}</p>
                    <p className="text-text-secondary text-sm leading-relaxed">{body}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-10">
              <h2 className="font-semibold text-text-primary text-xl mb-6">{tr.experience_heading}</h2>
              <div className="flex flex-col gap-0">
                {tr.experience.map((item, i) => (
                  <div key={item.company} className="relative pl-6 pb-8 last:pb-0">
                    <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-accent" />
                    {i < tr.experience.length - 1 && (
                      <div className="absolute left-[3px] top-3.5 bottom-0 w-px bg-border-default" />
                    )}
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-medium text-text-primary text-sm">{item.role}</span>
                      <span className="text-text-disabled text-xs">·</span>
                      <span className="text-accent text-sm font-medium">{item.company}</span>
                    </div>
                    <p className="text-text-disabled text-xs mb-2">{item.period}</p>
                    <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-semibold text-text-primary text-xl mb-4">{tr.path_heading}</h2>
              <p className="text-text-secondary leading-relaxed">{tr.path_body}</p>
            </section>
          </div>

          {/* ── Right: photo + skills + built with AI ── */}
          <div className="lg:sticky lg:top-28 flex flex-col gap-6">

            <div className="rounded-md overflow-hidden border border-border-default">
              <img
                src="/photo.png"
                alt="Illia Usiuk"
                className="w-full object-cover object-top aspect-[4/5]"
              />
            </div>

            <div className="rounded-md bg-bg-secondary border border-border-default p-6">
              <h2 className="font-semibold text-text-primary text-base mb-5">{tr.skills_heading}</h2>
              <div className="space-y-5">
                {Object.entries(skills).map(([category, items]) => (
                  <div key={category}>
                    <p className="text-text-disabled text-xs uppercase tracking-wider mb-2">{category}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map(skill => (
                        <span
                          key={skill}
                          className="text-sm px-2.5 py-1 rounded-sm bg-bg-tertiary border border-border-default text-text-secondary"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
