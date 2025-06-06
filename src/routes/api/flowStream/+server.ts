import { error } from "@sveltejs/kit"

export async function GET() {
  if (!globalThis.__flow_running)
    throw error(409, { message: "stream not running" })

  globalThis.__flow_clients = globalThis.__flow_clients || []
  let interval: NodeJS.Timeout
  const stream = new ReadableStream<string>({
    start(ctrl) {
      const send = () => {
        if (!globalThis.__flow_running) return ctrl.close()
        ctrl.enqueue(`data: ${JSON.stringify({ price: 64000 })}\n\n`)
      }
      send()
      interval = setInterval(send, 1000)
    },
    cancel() {
      clearInterval(interval)
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
