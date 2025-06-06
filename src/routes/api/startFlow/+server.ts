import { json } from "@sveltejs/kit"

export const POST = async () => {
  globalThis.__flow_running = true
  return json({ ok: true })
}
