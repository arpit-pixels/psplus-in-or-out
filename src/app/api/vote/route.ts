import { Ratelimit } from "@upstash/ratelimit";
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

const limiter = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(5, "30 s"),
  analytics: false,
  prefix: "ratelimit:vote",
});

function keyFor(side: Side) {
  return side === "in" ? KEY_IN : KEY_OUT;
}

function readIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real;
  return "anon";
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

async function rateLimited(ip: string) {
  const { success, reset } = await limiter.limit(ip);
  if (success) return null;
  const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
  return Response.json(
    { error: "Too many requests", retryAfter },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfter) },
    }
  );
}

export async function POST(request: Request) {
  const side = await parseSide(request);
  if (!side) {
    return Response.json({ error: "Invalid side" }, { status: 400 });
  }

  const limited = await rateLimited(readIp(request));
  if (limited) return limited;

  try {
    await ensureSeed();

    const geo = readGeo(request);
    const entry: RecentVote = {
      side,
      city: geo.city,
      country: geo.country,
      ts: Date.now(),
    };

    const pipe = redis.pipeline();
    pipe.incr(keyFor(side));
    pipe.lpush(KEY_RECENT, JSON.stringify(entry));
    pipe.ltrim(KEY_RECENT, 0, 19);
    pipe.mget(KEY_IN, KEY_OUT);
    const results = (await pipe.exec()) as [number, number, string, (number | null)[]];
    const [, , , counts] = results;

    return Response.json({
      in: Number(counts?.[0] ?? 0),
      out: Number(counts?.[1] ?? 0),
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

  const limited = await rateLimited(readIp(request));
  if (limited) return limited;

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
