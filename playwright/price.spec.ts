import { test, expect } from "@playwright/test"

// verify price updates on start and freezes on stop
// also ensure placeholder resets when changing instrument

test("price stream start and stop", async ({ page }) => {
  await page.goto("/dashboard")
  await page.getByRole("button", { name: "Start Streams" }).click()
  const first = await page.locator(".stat-value").textContent()
  await page.waitForTimeout(1500)
  const second = await page.locator(".stat-value").textContent()
  expect(first).not.toEqual(second)

  await page.getByRole("button", { name: "Stop Streams" }).click()
  const frozen = await page.locator(".stat-value").textContent()
  await page.waitForTimeout(3000)
  const still = await page.locator(".stat-value").textContent()
  expect(frozen).toEqual(still)
})

test("price resets on coin change", async ({ page }) => {
  await page.goto("/dashboard")
  await page.getByRole("button", { name: "Start Streams" }).click()
  await page.waitForTimeout(1000)
  await page.getByText("BTC").click()
  await page.getByRole("button", { name: "ETH-PERP" }).click()
  await expect(page.locator(".stat-value")).toHaveText("--")
  await page.waitForTimeout(1200)
  await expect(page.locator(".stat-value")).not.toHaveText("--")
})
