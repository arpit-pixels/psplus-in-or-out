import { redis, KEY_RECENT, type RecentVote } from "@/lib/redis";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const raw = await redis.lrange<string | RecentVote>(KEY_RECENT, 0, 9);
    const items = raw.map((entry) => {
      if (typeof entry === "string") {
        try {
          return JSON.parse(entry) as RecentVote;
        } catch {
          return null;
        }
      }
      return entry;
    }).filter((v): v is RecentVote => v !== null);
    return Response.json(
      { items },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return Response.json({ items: [] }, { status: 200 });
  }
}
