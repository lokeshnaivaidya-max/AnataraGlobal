// =============================================================================
// navConfig.ts — Antara Global Navigation Data Structure
// =============================================================================

export interface NavItem {
  label: string
  href: string
}

export interface NavGroup {
  heading: string
  items: NavItem[]
}

export interface NavDropdown {
  type: 'flat' | 'grouped'
  flat?: NavItem[]
  groups?: NavGroup[]
}

export interface NavLink {
  label: string
  href?: string
  dropdown?: NavDropdown
}

export const navConfig: NavLink[] = [
  {
    label: 'Home',
    href: '/',
  },

  // ── About ──────────────────────────────────────────────────────────────────
  {
    label: 'About',
    dropdown: {
      type: 'flat',
      flat: [
        { label: 'About Antara Global', href: '/about' },
        { label: 'Vision & Mission',    href: '/about/vision-mission' },
        { label: 'Our Philosophy',      href: '/about/philosophy' },
        { label: 'Core Values',         href: '/about/core-values' },
        { label: 'Why Antara Global',   href: '/about/why-us' },
        { label: 'Brand Story',         href: '/about/brand-story' },
      ],
    },
  },

  // ── Services ───────────────────────────────────────────────────────────────
  {
    label: 'Services',
    dropdown: {
      type: 'grouped',
      groups: [
        {
          heading: 'Strategic Business Advisory',
          items: [
            { label: 'Business Strategy',      href: '/services/business-strategy' },
            { label: 'Growth Planning',         href: '/services/growth-planning' },
            { label: 'Market Positioning',      href: '/services/market-positioning' },
            { label: 'Business Transformation', href: '/services/business-transformation' },
            { label: 'Operational Excellence',  href: '/services/operational-excellence' },
            { label: 'Expansion Planning',      href: '/services/expansion-planning' },
          ],
        },
        {
          heading: 'Venture Readiness Advisory',
          items: [
            { label: 'Business Diagnostics',          href: '/services/business-diagnostics' },
            { label: 'Investment Readiness Assessment',href: '/services/investment-readiness' },
            { label: 'Investor Preparedness',         href: '/services/investor-preparedness' },
            { label: 'Pitch Deck Development',        href: '/services/pitch-deck' },
            { label: 'Financial Modelling',           href: '/services/financial-modelling' },
            { label: 'Due Diligence Preparation',     href: '/services/due-diligence' },
            { label: 'Fundraising Strategy',          href: '/services/fundraising-strategy' },
          ],
        },
        {
          heading: 'Fundraising Support',
          items: [
            { label: 'Capital Planning',           href: '/services/capital-planning' },
            { label: 'Investor Readiness',         href: '/services/investor-readiness' },
            { label: 'Financial Projections',      href: '/services/financial-projections' },
            { label: 'Data Room Preparation',      href: '/services/data-room' },
            { label: 'Investor Communication',     href: '/services/investor-communication' },
            { label: 'Fundraising Coordination',   href: '/services/fundraising-coordination' },
            { label: 'Strategic Introductions',    href: '/services/strategic-introductions' },
          ],
        },
        {
          heading: 'MSME Growth Advisory',
          items: [
            { label: 'Growth Strategy',          href: '/services/msme-growth-strategy' },
            { label: 'Financial Preparedness',   href: '/services/msme-financial-preparedness' },
            { label: 'Debt Readiness',           href: '/services/msme-debt-readiness' },
            { label: 'Government Scheme Awareness', href: '/services/govt-schemes' },
            { label: 'Compliance Awareness',     href: '/services/compliance-awareness' },
            { label: 'Capacity Building',        href: '/services/capacity-building' },
          ],
        },
      ],
    },
  },

  // ── Solutions ──────────────────────────────────────────────────────────────
  {
    label: 'Solutions',
    dropdown: {
      type: 'grouped',
      groups: [
        {
          heading: 'Startups',
          items: [
            { label: 'Early Stage',          href: '/solutions/early-stage' },
            { label: 'Growth Stage',         href: '/solutions/growth-stage' },
            { label: 'Investment Readiness', href: '/solutions/investment-readiness' },
          ],
        },
        {
          heading: 'MSMEs',
          items: [
            { label: 'Manufacturing',        href: '/solutions/manufacturing' },
            { label: 'Services',             href: '/solutions/services' },
            { label: 'Family Businesses',    href: '/solutions/family-businesses' },
            { label: 'Export Businesses',    href: '/solutions/export-businesses' },
            { label: 'Emerging Businesses',  href: '/solutions/emerging-businesses' },
          ],
        },
        {
          heading: 'Sectors',
          items: [
            { label: 'Healthcare',        href: '/solutions/healthcare' },
            { label: 'Technology',        href: '/solutions/technology' },
            { label: 'SaaS',              href: '/solutions/saas' },
            { label: 'EdTech',            href: '/solutions/edtech' },
            { label: 'D2C',               href: '/solutions/d2c' },
            { label: 'Social Enterprises',href: '/solutions/social-enterprises' },
          ],
        },
      ],
    },
  },

  // ── Ecosystem ──────────────────────────────────────────────────────────────
  {
    label: 'Ecosystem',
    dropdown: {
      type: 'grouped',
      groups: [
        {
          heading: 'Capital Network',
          items: [
            { label: 'Individual Investors',         href: '/ecosystem/individual-investors' },
            { label: 'Angel Investors',              href: '/ecosystem/angel-investors' },
            { label: 'Angel Networks',               href: '/ecosystem/angel-networks' },
            { label: 'Venture Capital Firms',        href: '/ecosystem/venture-capital' },
            { label: 'Family Offices',               href: '/ecosystem/family-offices' },
            { label: 'Strategic Investors',          href: '/ecosystem/strategic-investors' },
            { label: 'Corporate Investors',          href: '/ecosystem/corporate-investors' },
            { label: 'Institutional Investors',      href: '/ecosystem/institutional-investors' },
            { label: 'NBFCs',                        href: '/ecosystem/nbfcs' },
            { label: 'Lending Institutions',         href: '/ecosystem/lending-institutions' },
            { label: 'Alternative Funding Platforms',href: '/ecosystem/alternative-funding' },
          ],
        },
        {
          heading: 'Strategic Partners',
          items: [
            { label: 'Chartered Accountants',  href: '/ecosystem/chartered-accountants' },
            { label: 'Company Secretaries',    href: '/ecosystem/company-secretaries' },
            { label: 'Legal Advisors',         href: '/ecosystem/legal-advisors' },
            { label: 'Financial Professionals',href: '/ecosystem/financial-professionals' },
            { label: 'Mentors',                href: '/ecosystem/mentors' },
            { label: 'Consultants',            href: '/ecosystem/consultants' },
            { label: 'Incubators',             href: '/ecosystem/incubators' },
            { label: 'Accelerators',           href: '/ecosystem/accelerators' },
            { label: 'Venture Networks',       href: '/ecosystem/venture-networks' },
            { label: 'Institutional Partners', href: '/ecosystem/institutional-partners' },
          ],
        },
      ],
    },
  },

  // ── Knowledge Hub ──────────────────────────────────────────────────────────
  {
    label: 'Knowledge Hub',
    dropdown: {
      type: 'grouped',
      groups: [
        {
          heading: 'Resources',
          items: [
            { label: 'Financial Knowledge', href: '/knowledge/financial-knowledge' },
            { label: 'Business Resources',  href: '/knowledge/business-resources' },
            { label: 'Blogs',               href: '/knowledge/blogs' },
            { label: 'Downloads',           href: '/knowledge/downloads' },
            { label: 'Financial Literacy',  href: '/knowledge/financial-literacy' },
          ],
        },
        {
          heading: 'Events & Programs',
          items: [
            { label: 'Workshops',         href: '/knowledge/workshops' },
            { label: 'Webinars',          href: '/knowledge/webinars' },
            { label: 'Founder Bootcamps', href: '/knowledge/founder-bootcamps' },
            { label: 'Industry Sessions', href: '/knowledge/industry-sessions' },
            { label: 'Expert Panels',     href: '/knowledge/expert-panels' },
          ],
        },
      ],
    },
  },

  // ── Contact ────────────────────────────────────────────────────────────────
  {
    label: 'Contact',
    dropdown: {
      type: 'flat',
      flat: [
        { label: 'Contact Us',       href: '/contact' },
        { label: 'Book Consultation',href: '/contact/book-consultation' },
        { label: 'Partner With Us',  href: '/contact/partner-with-us' },
      ],
    },
  },
]

// Phase 2 / 3 portals — hidden until implemented
export const futureLinks: NavItem[] = [
  { label: 'Founder Dashboard', href: '/dashboard/founder' },
  { label: 'Investor Portal',   href: '/portal/investor' },
  { label: 'Partner Portal',    href: '/portal/partner' },
  { label: 'Login / Sign In',   href: '/login' },
]
