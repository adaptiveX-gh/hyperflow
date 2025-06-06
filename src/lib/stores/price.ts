import { writable, derived } from "svelte/store"

export const priceStore = writable<number | null>(null)

export const prevCloseStore = writable<number | null>(null)

export const pctChangeStore = derived(
  [priceStore, prevCloseStore],
  ([price, prev]) =>
    price !== null && prev !== null && prev !== 0
      ? (price - prev) / prev
      : null,
)
