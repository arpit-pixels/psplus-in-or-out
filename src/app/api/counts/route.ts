import { redis, KEY_IN, KEY_OUT, ensureSeed, SEED_IN, SEED_OUT } from "@/lib/redis";

export const runtime = "edge";

export async function GET() {
  try {
    await ensureSeed();
    const [inVotes, outVotes] = await redis.mget<(number | null)[]>(
      KEY_IN,
      KEY_OUT
    );
    return Response.json(
      {
        in: Number(inVotes ?? SEED_IN),
        out: Number(outVotes ?? SEED_OUT),
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=3, stale-while-revalidate=10",
        },
      }
    );
  } catch {
    return Response.json(
      { in: SEED_IN, out: SEED_OUT },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "public, s-maxage=3, stale-while-revalidate=10",
        },
      }
    );
  }
}
