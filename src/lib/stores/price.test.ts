import { describe, it, expect } from "vitest"
import { priceStore, prevCloseStore, pctChangeStore } from "./price"
import { get } from "svelte/store"

describe("pctChangeStore", () => {
  it("computes percentage change", () => {
    priceStore.set(105)
    prevCloseStore.set(100)
    expect(get(pctChangeStore)).toBeCloseTo(0.05)
  })
})
