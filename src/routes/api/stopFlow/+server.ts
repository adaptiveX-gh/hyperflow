import { json } from "@sveltejs/kit"

export const POST = () => {
  globalThis.__flow_running = false
  return json({ ok: true })
}
