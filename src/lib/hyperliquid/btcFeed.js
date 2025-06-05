// @ts-check

/**
 * Poll Hyperliquid BTC data.
 * @param {(data: {markPrice:number, high24h:number, low24h:number})=>void} callback
 * @param {number} [interval=5000]
 * @returns {() => void}
 */
export function btcFeed(callback, interval = 5000) {
  /** @type {ReturnType<typeof setTimeout>} */
  let timer
  let canceled = false

  async function poll() {
    if (canceled) return
    try {
      const res = await fetch("https://api.hyperliquid.xyz/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "metaAndAssetCtxs" }),
      })
      const data = await res.json()
      const btc = data.assetCtxs?.find(
        /** @param {{name:string}} a */ (a) => a.name === "BTC",
      )
      if (btc) {
        callback({
          markPrice: btc.markPrice ?? btc.markPx,
          high24h: btc.high24h,
          low24h: btc.low24h,
        })
      }
    } catch (err) {
      console.error("btcFeed error", err)
    } finally {
      if (!canceled) timer = setTimeout(poll, interval)
    }
  }

  timer = setTimeout(poll, 0)

  return () => {
    canceled = true
    clearTimeout(timer)
  }
}
