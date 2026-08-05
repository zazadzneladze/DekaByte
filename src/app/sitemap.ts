import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/config/site";
import { getPublishedProjects } from "@/db/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const projects = await getPublishedProjects();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/work",
    "/services",
    "/about",
    "/estimate",
    "/contact",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${base}/work/${project.slug}`,
    lastModified: project.updatedAt,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...projectRoutes];
}
