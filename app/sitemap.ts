import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://in-varia.com';

  return [
    {
      url: baseUrl,
      lastModified: '2026-04-13',
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/metacog`,
      lastModified: '2026-04-13',
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];
}
