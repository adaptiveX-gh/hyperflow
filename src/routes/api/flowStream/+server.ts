import { error } from "@sveltejs/kit"

export async function GET() {
  if (!globalThis.__flow_running)
    throw error(409, { message: "stream not running" })

  globalThis.__flow_clients = globalThis.__flow_clients || []
  const stream = new ReadableStream<string>({
    start(ctrl) {
      const send = () => {
        if (!globalThis.__flow_running) return ctrl.close()
        ctrl.enqueue(`data: ${JSON.stringify({ price: 64000 })}\n\n`)
      }
      send()
      const id = setInterval(send, 1000)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(ctrl as any).signal.addEventListener("abort", () => clearInterval(id))
    },
    cancel() {
      if (globalThis.__flow_clients) {
        globalThis.__flow_clients = globalThis.__flow_clients.filter(
          (r: Response) => r !== response,
        )
      }
    },
  })

  const response = new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
  globalThis.__flow_clients.push(response)
  return response
}
