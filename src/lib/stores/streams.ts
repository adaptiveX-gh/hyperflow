import { writable } from "svelte/store"

export const activeCoin = writable("BTC-PERP")
export const streamRunning = writable(false)
