import { json } from "@sveltejs/kit"

export const POST = async ({ request }) => {
  try {
    const data = await request.json()
    if (data && typeof data.coin === "string") {
      globalThis.__flow_coin = data.coin
    }
  } catch {
    // ignore malformed JSON, coin will fall back to default
  }

  globalThis.__flow_running = true
  if (!globalThis.__flow_coin) {
    globalThis.__flow_coin = "BTC"
  }
  return json({ ok: true })
}
