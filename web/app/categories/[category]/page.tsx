import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ChevronRight, Layers } from "lucide-react";
import { getCatalog } from "@/lib/cache";
import { CatalogBrowser } from "@/components/CatalogBrowser";

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const catalog = await getCatalog();
  const cat = catalog.categories.find(
    (c) => c.slug.toLowerCase() === decodeURIComponent(category).toLowerCase()
  );

  const catName = cat ? cat.name : category;
  const title = `${catName} Apps - Shizuku Directory | ShizuPortal`;
  const description = `Browse all curated ${catName} applications compatible with Shizuku on Android. Install via ShizuStore.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const catalog = await getCatalog();
  const normalizedCategorySlug = decodeURIComponent(category).toLowerCase();

  const currentCategory = catalog.categories.find(
    (c) => c.slug.toLowerCase() === normalizedCategorySlug
  );

  if (!currentCategory) {
    notFound();
  }

  const categoryApps = catalog.apps.filter(
    (a) => a.categorySlug.toLowerCase() === normalizedCategorySlug
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          All Apps
        </Link>
        <ChevronRight className="w-3 h-3 opacity-40" />
        <span className="text-foreground font-medium">
          {currentCategory.name}
        </span>
      </div>

      {/* Category Banner */}
      <div className="shadcn-cardview p-6 sm:p-7">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono rounded border border-border px-1.5 py-0.5 text-muted-foreground">
                Category
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                {categoryApps.length} {categoryApps.length === 1 ? "app" : "apps"}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight mt-1">
              {currentCategory.name}
            </h1>
            <p className="text-xs text-muted-foreground mt-1 max-w-2xl leading-relaxed">
              Curated applications in {currentCategory.name} compatible with Shizuku.
              Install directly through ShizuStore on your Android device.
            </p>
          </div>
        </div>
      </div>

      {/* Catalog Browser pre-selected with this category */}
      <CatalogBrowser
        initialApps={catalog.apps}
        categories={catalog.categories}
        selectedCategorySlug={currentCategory.slug}
      />
    </div>
  );
}
