import { writable } from "svelte/store"

export const price = writable<number | null>(null)
