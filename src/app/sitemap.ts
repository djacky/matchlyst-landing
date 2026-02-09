import type { MetadataRoute } from "next";

const baseUrl = "https://www.matchlyst.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          en: baseUrl,
          es: `${baseUrl}/es`,
          it: `${baseUrl}/it`,
          ru: `${baseUrl}/ru`,
        },
      },
    },
  ];
}
