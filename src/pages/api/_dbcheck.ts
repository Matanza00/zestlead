// pages/api/_dbcheck.ts (Next.js pages router)
// or app/api/_dbcheck/route.ts for App Router (adjust syntax accordingly)
import { prisma } from "@/lib/prisma";

export default async function handler(req:any, res:any) {
  try {
    // Minimal query that hits both pgBouncer and DB
    const [now] = await prisma.$queryRawUnsafe<{ now: Date }[]>("select now()");
    const users = await prisma.user.count();

    // DO NOT print full DATABASE_URL—just the shape to confirm pooler vs direct
    const dbUrl = process.env.DATABASE_URL || "";
    const usingPooler = dbUrl.includes("pooler.supabase.com:6543");
    const usingDirect = dbUrl.includes("supabase.co:5432");
    const hasProjectRefInUser = dbUrl.includes("postgres.");

    res.status(200).json({
      ok: true,
      now: now?.now,
      users,
      env: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        usingPooler,
        usingDirect,
        hasProjectRefInUser, // must be true for pooler auth
      },
    });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
}
