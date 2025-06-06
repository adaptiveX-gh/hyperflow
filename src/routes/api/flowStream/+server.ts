import { PassThrough } from "node:stream"

export async function GET() {
  if (!globalThis.__flow_running) {
    return new Response("stream not running", { status: 409 })
  }

  const stream = new PassThrough()
  const timer = setInterval(() => {
    if (!globalThis.__flow_running) {
      clearInterval(timer)
      stream.end()
    } else {
      stream.write(`data: {"price":64000}\n\n`)
    }
  }, 1000)

  return new Response(stream as unknown as ReadableStream<Uint8Array>, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    },
  })
}
