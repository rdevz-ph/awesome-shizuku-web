import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAppBySlug, getCatalog } from "@/lib/cache";
import { AppDetailView } from "@/components/AppDetailView";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const app = await getAppBySlug(slug);

  if (!app) {
    return {
      title: "App Not Found | ShizuPortal",
      description: "The requested Shizuku application could not be found.",
    };
  }

  const title = `${app.name} - Shizuku App | ShizuPortal`;
  const description = `${app.description} Install ${app.name} on Android via ShizuStore with Shizuku elevated privileges.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: app.iconUrl ? [{ url: app.iconUrl }] : [],
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function AppPage({ params }: PageProps) {
  const { slug } = await params;
  const app = await getAppBySlug(slug);

  if (!app) {
    notFound();
  }

  const catalog = await getCatalog();
  const relatedApps = catalog.apps
    .filter((a) => a.categorySlug === app.categorySlug && a.slug !== app.slug)
    .sort((a, b) => (b.stars || 0) - (a.stars || 0))
    .slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AppDetailView app={app} relatedApps={relatedApps} />
    </div>
  );
}
