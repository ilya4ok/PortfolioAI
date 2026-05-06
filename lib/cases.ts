import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const CASES_DIR_EN = path.join(process.cwd(), 'content/cases/en')
const CASES_DIR_UK = path.join(process.cwd(), 'content/cases/uk')

export interface CaseHighlight {
  value: string
  label: string
}

export interface CaseFeature {
  icon: string
  title: string
  desc: string
}

export interface CaseSectionItem {
  icon: string
  title: string
  desc: string
}

export interface CaseProcessStep {
  step: number
  label: string
  desc: string
}

export interface CaseSection {
  title: string
  type: 'text' | 'cards' | 'callout' | 'process' | 'split'
  body?: string
  cta?: string
  cta_href?: string
  screenshot?: string
  screenshot2?: string
  items?: CaseSectionItem[]
  steps?: CaseProcessStep[]
}

export interface CaseFrontmatter {
  slug: string
  title: string
  description: string
  metric: string
  tools: string[]
  icon: string
  status: 'active' | 'locked'
  ogImage?: string
  logo?: string
  highlights?: CaseHighlight[]
  features?: CaseFeature[]
  sections?: CaseSection[]
}

function readCase(locale: 'en' | 'uk', slug: string): { frontmatter: CaseFrontmatter; content: string } | null {
  const dir = locale === 'en' ? CASES_DIR_EN : CASES_DIR_UK
  const filePath = path.join(dir, `${slug}.mdx`)

  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  return {
    frontmatter: { slug, ...data } as CaseFrontmatter,
    content,
  }
}

export function getAllCases(locale: 'en' | 'uk' = 'en'): CaseFrontmatter[] {
  const dir = CASES_DIR_EN // Always enumerate from EN
  if (!fs.existsSync(dir)) return []

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'))

  return files
    .map(file => {
      const slug = file.replace('.mdx', '')
      const result = readCase(locale, slug) ?? readCase('en', slug) // EN fallback
      if (!result) return null
      return result.frontmatter
    })
    .filter((c): c is CaseFrontmatter => c !== null)
    .filter(c => c.status === 'active')
}

export function getCaseBySlug(
  slug: string,
  locale: 'en' | 'uk' = 'en'
): { frontmatter: CaseFrontmatter; content: string } | null {
  return readCase(locale, slug) ?? readCase('en', slug) ?? null
}

export function getActiveSlugs(): string[] {
  const dir = CASES_DIR_EN
  if (!fs.existsSync(dir)) return []

  return fs
    .readdirSync(dir)
    .filter(f => f.endsWith('.mdx'))
    .map(f => {
      const slug = f.replace('.mdx', '')
      const result = readCase('en', slug)
      return result?.frontmatter.status === 'active' ? slug : null
    })
    .filter((s): s is string => s !== null)
}

export function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}
