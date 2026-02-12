import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/private/',
        '/*.json$',
        '/*.xml$',
      ],
    },
    sitemap: 'https://primeaccounting.com/sitemap.xml',
  }
}