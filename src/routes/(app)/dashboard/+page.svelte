<!--  src/routes/(app)/dashboard/+page.svelte  -->
<script lang="ts">
  /* ───────────────────────────────────────
	   UI components
	   ─────────────────────────────────────── */
  import TopBar from "$lib/components/TopBar.svelte"
  import PriceKPI from "$lib/components/PriceKPI.svelte"
  import PriceGauge from "$lib/components/PriceGauge.svelte"

  /* ───────────────────────────────────────
	   Dashboard context
	   ─────────────────────────────────────── */
  import { getContext } from "svelte"
  import type { Writable } from "svelte/store"

  /** active section highlight in the side-/top-nav */
  const adminSection: Writable<string> = getContext("adminSection")
  adminSection.set("dashboard")

  /* ───────────────────────────────────────
	   Live data (replace with your real stores)
	   ─────────────────────────────────────── */
  let price = 0 // current mark-price
  let hi24h = 1 // 24-hour high
  let lo24h = 0 // 24-hour low

  /* ▼ If you already have a price store, do:
	   import { priceStore, hiStore, loStore } from '$lib/stores/price';
	   $: price = $priceStore;
	   $: hi24h = $hiStore;
	   $: lo24h = $loStore;
	*/
</script>

<svelte:head>
  <title>Dashboard</title>
</svelte:head>

<!-- Top navigation -->
<TopBar />

<!-- KPI strip -->
<section class="mt-4 flex flex-wrap justify-center gap-4">
  <PriceKPI />

  <!-- placeholder cards for future KPIs (S2-01) -->
  <div class="card w-40 bg-base-200 shadow-sm flex items-center justify-center">
    <span class="text-xs opacity-60">OBI KPI</span>
  </div>

  <div class="card w-40 bg-base-200 shadow-sm flex items-center justify-center">
    <span class="text-xs opacity-60">Bias KPI</span>
  </div>
</section>

<!-- Gauge row -->
<section class="mt-8 max-w-4xl mx-auto">
  <PriceGauge {price} hi={hi24h} lo={lo24h} />
</section>
