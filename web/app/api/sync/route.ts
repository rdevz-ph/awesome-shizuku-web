import { NextResponse } from "next/server";
import { syncCatalog } from "@/lib/cache";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const freshCatalog = await syncCatalog(true);
    return NextResponse.json({
      success: true,
      message: "Catalog successfully synchronized from awesome-shizuku",
      stats: freshCatalog.stats,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}
