import { writable } from "svelte/store"

export const priceStore = writable<number | null>(null)
