import { PassThrough } from "node:stream"

export async function GET() {
  if (!globalThis.__flow_running) {
    return new Response("stream not running", { status: 409 })
  }

  const stream = new PassThrough()
  const timer = setInterval(async () => {
    if (!globalThis.__flow_running) {
      clearInterval(timer)
      stream.end()
      return
    }

    try {
      const res = await fetch("https://api.hyperliquid.xyz/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "metaAndAssetCtxs" }),
      })
      const { markPrices } = await res.json()
      const btc = markPrices.find((p: { asset: string }) => p.asset === "BTC")
      if (btc) {
        stream.write(`data: ${JSON.stringify({ price: btc.markPrice })}\n\n`)
      }
    } catch (err) {
      console.error("failed to fetch price", err)
    }
  }, 1000)

  stream.on("close", () => {
    clearInterval(timer)
  })

  return new Response(stream as unknown as ReadableStream<Uint8Array>, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    },
  })
}
