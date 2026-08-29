import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site-config';
import { TEACHER_TOOLS } from '@/data/tools';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const currentDate = new Date();

  // 1. Halaman Utama
  const mainRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tools/soal-generator`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
  ];

  // 2. Halaman Alat Bantu Lainnya (Coming Soon / Active)
  const toolRoutes: MetadataRoute.Sitemap = TEACHER_TOOLS.filter(
    (tool) => tool.path !== '/tools/soal-generator'
  ).map((tool) => ({
    url: `${baseUrl}${tool.path}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: tool.status === 'active' ? 0.9 : 0.7,
  }));

  return [...mainRoutes, ...toolRoutes];
}
