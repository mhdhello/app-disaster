import { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://app-disaster.vercel.app"

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: `${baseUrl}/report-damage`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/offer-help`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/volunteers`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/maps`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/damage-report`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/donor-support`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.7,
    },
  ]
}

