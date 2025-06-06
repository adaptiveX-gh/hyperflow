import { test, expect } from "@playwright/test"

const base = "http://localhost:5173"

async function readEvents(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  count: number,
) {
  const decoder = new TextDecoder()
  let buffer = ""
  const events: any[] = []
  const start = Date.now()
  while (events.length < count && Date.now() - start < 3000) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value)
    let idx
    while ((idx = buffer.indexOf("\n\n")) !== -1) {
      const line = buffer.slice(0, idx).trim()
      buffer = buffer.slice(idx + 2)
      if (line.startsWith("data:")) {
        events.push(JSON.parse(line.slice(5).trim()))
      }
    }
  }
  return events
}

test.describe("flow stream", () => {
  test("startFlow then stopFlow closes stream", async () => {
    const res = await fetch(`${base}/api/startFlow`, { method: "POST" })
    expect(res.ok).toBeTruthy()

    const streamRes = await fetch(`${base}/api/flowStream`)
    expect(streamRes.status).toBe(200)
    expect(streamRes.headers.get("content-type")).toContain("text/event-stream")

    const reader = streamRes.body!.getReader()
    const events = await readEvents(reader, 3)
    expect(events.length).toBeGreaterThanOrEqual(3)

    const stop = await fetch(`${base}/api/stopFlow`, { method: "POST" })
    expect(stop.ok).toBeTruthy()

    const result = await Promise.race([
      reader.read(),
      new Promise((r) => setTimeout(() => r({ timeout: true }), 1000)),
    ])
    expect("done" in result && (result as any).done).toBe(true)
  })
})

test("stream responds 409 when not started", async () => {
  const resp = await fetch(`${base}/api/flowStream`)
  expect(resp.status).toBe(409)
})
