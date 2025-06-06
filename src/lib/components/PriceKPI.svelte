<script lang="ts">
  import { onDestroy } from "svelte"
  import { priceStore, prevCloseStore, pctChangeStore } from "$lib/stores/price"
  import {
    ArrowTrendingUpSolid,
    ArrowTrendingDownSolid,
  } from "@heroicons/svelte/20/solid"
  import { activeCoin, streamRunning } from "$lib/stores/streams"

  let es: EventSource | null = null
  let currentCoin: string

  const fmt = (v: number) =>
    "$" +
    (v >= 1000
      ? v.toLocaleString("en-US", { maximumFractionDigits: 0 })
      : v.toLocaleString("en-US", { maximumFractionDigits: 2 }))

  function connect(coin: string) {
    if (es) es.close()
    es = new EventSource("/api/flowStream")
    es.onmessage = (e) => {
      const { price, prevDayPx } = JSON.parse(e.data)
      const num = Number(price)
      if (!Number.isNaN(num)) priceStore.set(num)
      const prev = Number(prevDayPx)
      if (!Number.isNaN(prev)) prevCloseStore.set(prev)
    }
    es.onerror = () => es?.close()
    currentCoin = coin
  }

  $: if ($streamRunning && !es) connect($activeCoin)
  $: if (!$streamRunning && es) {
    es.close()
    es = null
  }
  $: if ($streamRunning && es && $activeCoin !== currentCoin) {
    priceStore.set(null)
    prevCloseStore.set(null)
    connect($activeCoin)
  }

  onDestroy(() => es?.close())
</script>

<article
  role="figure"
  aria-label="Live price"
  class="card bg-base-100 card-border border-base-300 w-full sm:w-60"
>
  <div class="stats">
    <div class="stat">
      <!-- title -->
      <div class="stat-title">{$activeCoin} Price</div>

      <!-- value -->
      <div class="stat-value">
        {#if $priceStore !== null}{fmt($priceStore)}{:else}--{/if}
      </div>

      <!-- change -->
      <div class="stat-desc flex items-center gap-2 text-sm">
        {#if $pctChangeStore !== null}
          {#if $pctChangeStore > 0}
            <ArrowTrendingUpSolid
              class="size-4 text-success"
              aria-hidden="true"
            />
            <span class="text-success">
              {($pctChangeStore * 100).toFixed(2)}% higher than 24 h close
            </span>
          {:else if $pctChangeStore < 0}
            <ArrowTrendingDownSolid
              class="size-4 text-error"
              aria-hidden="true"
            />
            <span class="text-error">
              {Math.abs($pctChangeStore * 100).toFixed(2)}% lower than 24 h
              close
            </span>
          {/if}
        {:else}
          <span class="opacity-60">—</span>
        {/if}
      </div>
    </div>
  </div>
</article>
