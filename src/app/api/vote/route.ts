import {
  redis,
  KEY_IN,
  KEY_OUT,
  KEY_RECENT,
  ensureSeed,
  type Side,
  type RecentVote,
} from "@/lib/redis";

export const runtime = "edge";
export const dynamic = "force-dynamic";

function keyFor(side: Side) {
  return side === "in" ? KEY_IN : KEY_OUT;
}

function readGeo(request: Request): { city: string | null; country: string | null } {
  const city = request.headers.get("x-vercel-ip-city");
  const country = request.headers.get("x-vercel-ip-country");
  return {
    city: city ? decodeURIComponent(city) : null,
    country: country || null,
  };
}

async function parseSide(request: Request): Promise<Side | null> {
  try {
    const body = (await request.json()) as { side?: string };
    if (body.side === "in" || body.side === "out") return body.side;
  } catch {
    /* fall through */
  }
  return null;
}

export async function POST(request: Request) {
  const side = await parseSide(request);
  if (!side) {
    return Response.json({ error: "Invalid side" }, { status: 400 });
  }

  try {
    await ensureSeed();
    await redis.incr(keyFor(side));

    const geo = readGeo(request);
    const entry: RecentVote = {
      side,
      city: geo.city,
      country: geo.country,
      ts: Date.now(),
    };
    await redis.lpush(KEY_RECENT, JSON.stringify(entry));
    await redis.ltrim(KEY_RECENT, 0, 19);

    const [inVotes, outVotes] = await redis.mget<(number | null)[]>(KEY_IN, KEY_OUT);
    return Response.json({
      in: Number(inVotes ?? 0),
      out: Number(outVotes ?? 0),
      side,
    });
  } catch (e) {
    return Response.json(
      { error: "Vote failed", detail: (e as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const side = await parseSide(request);
  if (!side) {
    return Response.json({ error: "Invalid side" }, { status: 400 });
  }

  try {
    const current = (await redis.get<number>(keyFor(side))) ?? 0;
    if (current > 0) {
      await redis.decr(keyFor(side));
    }
    const [inVotes, outVotes] = await redis.mget<(number | null)[]>(KEY_IN, KEY_OUT);
    return Response.json({
      in: Number(inVotes ?? 0),
      out: Number(outVotes ?? 0),
      side,
      undone: true,
    });
  } catch (e) {
    return Response.json(
      { error: "Undo failed", detail: (e as Error).message },
      { status: 500 }
    );
  }
}
