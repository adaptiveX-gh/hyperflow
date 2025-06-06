import { PassThrough } from 'node:stream';


export async function GET() {
  if (!globalThis.__flow_running) {
    return new Response('stream not running', { status: 409 });
  }

  const stream = new PassThrough()
  let closed = false

  // Helper function to fetch price
  async function fetchPrice() {
    try {
      const coin = globalThis.__flow_coin ?? "BTC";
      const res = await fetch("https://api.hyperliquid.xyz/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "metaAndAssetCtxs", coin }),
      });

      if (!res.ok) throw new Error(await res.text());

      const { markPrices } = await res.json();
      const asset = coin.split("-")[0];
      const mp = markPrices.find((p: { asset: string }) => p.asset === asset);
      return mp?.markPrice ?? null;
    } catch (err) {
      console.error("failed to fetch price", err);
      return null;
    }
  }

  const timer = setInterval(async () => {
    if (closed || !globalThis.__flow_running) {
      clearInterval(timer);
      if (!closed) stream.end();
      return;
    }
    try {
      const price = await fetchPrice();
      if (price !== null) {
        stream.write(`data: ${JSON.stringify({ price })}\n\n`);
      }
    } catch (e) {
      console.error('failed to fetch price', e);
    }
  }, 1_000);

  // stop interval if client disconnects
  stream.on('close', () => {
    closed = true;
    clearInterval(timer);
  });

  stream.on("close", () => {
    closed = true
    clearInterval(timer)
  })

  return new Response(stream as unknown as ReadableStream<Uint8Array>, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    }
  });
}
