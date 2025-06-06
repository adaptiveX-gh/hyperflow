<script lang="ts">
  import { onMount, onDestroy } from "svelte"
  import PriceGauge from "$lib/components/PriceGauge.svelte"
  import PriceKPI from "$lib/components/PriceKPI.svelte"
  import TopBar from "$lib/components/TopBar.svelte"
  import { btcFeed } from "$lib/hyperliquid/btcFeed.js"
  import { getContext } from "svelte"
  import type { Writable } from "svelte/store"

  let adminSection: Writable<string> = getContext("adminSection")
  adminSection.set("dashboard")

  let markPrice = 0
  let high24h = 0
  let low24h = 0
  let percent = 0
  let stop: () => void

  onMount(() => {
    stop = btcFeed(
      /** @param {{markPrice:number, high24h:number, low24h:number}} p */
      ({ markPrice: m, high24h: h, low24h: l }) => {
        markPrice = m ?? 0
        high24h = h ?? 0
        low24h = l ?? 0
        const range = high24h - low24h
        percent = range > 0 ? ((markPrice - low24h) / range) * 100 : 0
      },
    )
  })

  onDestroy(() => {
    stop && stop()
  })
</script>

<svelte:head>
  <title>Dashboard</title>
</svelte:head>

<TopBar />

<section class="flex flex-wrap gap-4 mt-4 justify-center">
  <PriceKPI />
  <!-- placeholders for OBI & Bias KPI (S2-01) -->
</section>

<div class="card bg-base-200 shadow-xl">
  <div class="card-body">
    <h2 class="card-title">BTC 24 h Range Gauge</h2>
    <PriceGauge value={percent} title={`BTC $${markPrice.toLocaleString()}`} />
  </div>
</div>
