/**
 *  src/routes/api/flowStream/+server.ts
 *  Streams mark-price once per second via Server-Sent Events.
 *  – Works in dev & prod
 *  – Stops cleanly on Stop-Flow or socket close
 *  – Guards against all Hyperliquid response variants
 */

import { PassThrough } from "node:stream"

/* ------------------------------------------------------------------ */
/*  GET  /api/flowStream                                               */
/* ------------------------------------------------------------------ */
export async function GET() {
  /* Require POST /api/startFlow first */
  if (!globalThis.__flow_running) {
    return new Response("stream not running", { status: 409 })
  }

  const stream = new PassThrough()
  let closed = false

  const ENDPOINT = "https://api.hyperliquid.xyz/info"
  const BODY = JSON.stringify({ type: "metaAndAssetCtxs" }) // ← no coin

  /* -------------------------------------------------------------- */
  /*  Helper: fetch active-asset mark-price safely                  */
  /* -------------------------------------------------------------- */
  async function fetchPrice(): Promise<number | null> {
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: BODY,
      })

      if (!res.ok) {
        console.error("HL HTTP", res.status, await res.text())
        return null
      }

      const json: {
        markPrices?: { asset: string; markPrice: number }[]
        assetCtx?: { markPrice?: number }
        error?: string
        [key: string]: unknown
      } = await res.json()

      /* 1 · meta reply – array of markPrices */
      if (Array.isArray(json.markPrices)) {
        const asset = (globalThis.__flow_coin ?? "BTC").split("-")[0]
        const mp = json.markPrices.find((p) => p.asset === asset)
        return typeof mp?.markPrice === "number" ? mp.markPrice : null
      }

      /* 2 · single-asset reply – assetCtx */
      if (
        json.assetCtx?.markPrice &&
        typeof json.assetCtx.markPrice === "number"
      ) {
        return json.assetCtx.markPrice
      }

      /* 3 · explicit error from API */
      if (json.error) {
        console.error("HL API", json.error)
        return null
      }

      console.warn("HL unknown schema", json)
      return null
    } catch (err) {
      console.error("fetchPrice network error", (err as Error).message)
      return null
    }
  }

  /* -------------------------------------------------------------- */
  /*  1-Hz push loop                                                 */
  /* -------------------------------------------------------------- */
  const timer = setInterval(async () => {
    if (closed || !globalThis.__flow_running) {
      clearInterval(timer)
      if (!closed) stream.end()
      return
    }

    const price = await fetchPrice()
    if (price !== null) {
      stream.write(`data: ${JSON.stringify({ price })}\n\n`)
    }
  }, 1_000)

  /* Close timer if client disconnects */
  stream.on("close", () => {
    closed = true
    clearInterval(timer)
  })

  /* SSE response */
  return new Response(stream as unknown as ReadableStream<Uint8Array>, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
