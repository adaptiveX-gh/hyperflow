import { test, expect } from "@playwright/test"

// Helper to mock API
async function setupRoutes(page) {
  await page.route("/api/startFlow", (route) => {
    route.fulfill({ status: 200, body: "ok" })
  })
  await page.route("/api/stopFlow", (route) => {
    route.fulfill({ status: 200, body: "ok" })
  })
}

test.describe("TopBar", () => {
  test("start and stop streams", async ({ page }) => {
    await setupRoutes(page)
    await page.goto("/dashboard")

    // dropdown renders
    await page.getByText("BTC").click()
    await expect(page.getByRole("button", { name: "ETH-PERP" })).toBeVisible()

    // select instrument
    await page.getByRole("button", { name: "ETH-PERP" }).click()
    await expect(page.getByText("ETH")).toBeVisible()

    // start streams
    const [request] = await Promise.all([
      page.waitForRequest((req) => req.url().includes("/api/startFlow")),
      page.getByRole("button", { name: "Start Streams" }).click(),
    ])
    expect(request.method()).toBe("POST")
    expect(await request.postDataJSON()).toEqual({ coin: "ETH-PERP" })

    // button toggles
    await expect(
      page.getByRole("button", { name: "Stop Streams" }),
    ).toBeVisible()

    // stop streams
    const [stopReq] = await Promise.all([
      page.waitForRequest("/api/stopFlow"),
      page.getByRole("button", { name: "Stop Streams" }).click(),
    ])
    expect(stopReq.method()).toBe("POST")
  })
})
