import { NextRequest, NextResponse } from "next/server";
import { getCatalog, syncCatalog } from "@/lib/cache";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get("refresh") === "true";
    const catalog = forceRefresh ? await syncCatalog(true) : await getCatalog();
    return NextResponse.json(catalog, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=1800",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Failed to load catalog", message },
      { status: 500 }
    );
  }
}
