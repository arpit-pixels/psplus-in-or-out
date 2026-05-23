import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export const KEY_IN = "votes:in";
export const KEY_OUT = "votes:out";
export const KEY_RECENT = "votes:recent";
export const KEY_SEED_FLAG = "votes:seeded";

export const SEED_IN = 23;
export const SEED_OUT = 47;

export async function ensureSeed() {
  const seeded = await redis.get<number | string | null>(KEY_SEED_FLAG);
  if (seeded) return;
  await redis.mset({
    [KEY_IN]: SEED_IN,
    [KEY_OUT]: SEED_OUT,
    [KEY_SEED_FLAG]: 1,
  });
}

export type Side = "in" | "out";

export type RecentVote = {
  side: Side;
  city: string | null;
  country: string | null;
  ts: number;
};
