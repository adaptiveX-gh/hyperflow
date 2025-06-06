import { json } from "@sveltejs/kit"

export const POST = async () => {
  globalThis.__flow_running = false
  if (globalThis.__flow_clients)
    globalThis.__flow_clients.forEach((res: Response) => res.body?.cancel())
  return json({ ok: true })
}
