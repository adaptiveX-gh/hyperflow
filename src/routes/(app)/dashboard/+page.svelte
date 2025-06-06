<script lang="ts">
  import PriceGauge from "$lib/components/PriceGauge.svelte"
  import PriceKPI from "$lib/components/PriceKPI.svelte"
  import TopBar from "$lib/components/TopBar.svelte"
  import { getContext } from "svelte"
  import type { Writable } from "svelte/store"

  let adminSection: Writable<string> = getContext("adminSection")
  adminSection.set("dashboard")

  let markPrice = 0
  let percent = 0
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
