import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/cache";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const catalog = await getCatalog();
    return NextResponse.json(catalog, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
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
