declare module "@vercel/kv" {
  export function put(key: string, value: string): Promise<void>;
}
import { kv } from "@vercel/kv";

export async function getTokens() {
  const access_token: string | null = await kv.get("ACCESS_TOKEN");
  const refresh_token: string | null = await kv.get("REFRESH_TOKEN");

  return { access_token, refresh_token };
}

export async function setTokens(access_token: string, refresh_token: string) {
  await kv.set("ACCESS_TOKEN", access_token);
  await kv.set("REFRESH_TOKEN", refresh_token);
}
