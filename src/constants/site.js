export const BRAND = {
  name: 'Eduzyra',
  parent: 'Althexus',
  tagline: 'Learning paths that ship.',
  supportEmail: 'eduzyraofficial@gmail.com',
  supportPhone: '+91 76687 43501',
  address: 'Meerut, Uttar Pradesh',
  addressNote: 'Remote-First Company',
}

// Althexus is the parent company — the site lives on its own domain, so
// "About Althexus" in the footer sends people there instead of an internal page.
export const ALTHEXUS_URL = 'https://althexus.com/'

export const SOCIAL_LINKS = {
  officialEmail: 'althexusofficial@gmail.com',
  website: ALTHEXUS_URL,
  linkedin: 'https://www.linkedin.com/company/althexus/',
  instagram: 'https://www.instagram.com/althexusofficial',
  facebook: 'https://www.facebook.com/share/1EgYt1N6gj/',
  twitter: 'https://x.com/Althexus',
  youtube: 'https://youtube.com/@althexus?si=zNrxkR3BGHtVy6XT',
  whatsappChannel: 'https://whatsapp.com/channel/0029Vb8oq4N7T8bXJ5eo9W1a',
  whatsapp: 'https://api.whatsapp.com/message/SV64GDK3P6ZKP',
}

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Courses', to: '/courses' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Feedback', to: '/feedback' },
]

export const FOOTER_LINKS = {
  Product: [
    { label: 'Browse courses', to: '/courses' },
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Pricing', to: '/courses' },
  ],
  Company: [
    { label: 'About Althexus', href: ALTHEXUS_URL, external: true },
    { label: 'Contact', to: '/contact' },
    { label: 'Feedback', to: '/feedback' },
  ],
  Account: [
    { label: 'Log in', to: '/login' },
    { label: 'Sign up', to: '/signup' },
  ],
}
