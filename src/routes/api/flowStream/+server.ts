import { PassThrough } from 'node:stream';

const ENDPOINT = 'https://api.hyperliquid.xyz/info';
const BODY     = JSON.stringify({ type: 'metaAndAssetCtxs' });

export async function GET() {
  if (!globalThis.__flow_running) {
    return new Response('stream not running', { status: 409 });
  }

  const stream = new PassThrough();
  let closed   = false;

  // Helper: fetch BTC mark price safely
  type MarkPrice = { asset: string; markPrice: number };
  async function fetchPrice(): Promise<number | null> {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: BODY
    });
    if (!res.ok) {
      // log plaintext on first failure
      console.error('Hyperliquid error', await res.text());
      return null;
    }
    const json = await res.json();
    const btc  = (json.markPrices as MarkPrice[] | undefined)?.find((p) => p.asset === 'BTC');
    return btc?.markPrice ?? null;
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

  return new Response(stream as unknown as ReadableStream<Uint8Array>, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    }
  });
}
