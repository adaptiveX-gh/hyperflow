import { PassThrough } from "node:stream"

export async function GET() {
  if (!globalThis.__flow_running) {
    return new Response("stream not running", { status: 409 })
  }

  const stream = new PassThrough()
  let closed = false

  const timer = setInterval(async () => {
    if (closed || !globalThis.__flow_running) {
      clearInterval(timer)
      stream.end()
      return
    }

    try {
      const coin = globalThis.__flow_coin ?? "BTC"
      const res = await fetch("https://api.hyperliquid.xyz/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "metaAndAssetCtxs", coin }),
      })

      if (!res.ok) throw new Error(await res.text())

      const { markPrices } = await res.json()
      const asset = coin.split("-")[0]
      const mp = markPrices.find((p: { asset: string }) => p.asset === asset)
      if (mp && !closed) {
        stream.write(`data: ${JSON.stringify({ price: mp.markPrice })}\n\n`)
      }
    } catch (err) {
      console.error("failed to fetch price", err)
    }
  }, 1000)

  stream.on("close", () => {
    closed = true
    clearInterval(timer)
  })

  return new Response(stream as unknown as ReadableStream<Uint8Array>, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    },
  })
}
