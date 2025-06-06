<script lang="ts">
  import { onDestroy } from "svelte"
  import { activeCoin, streamRunning } from "$lib/stores/streams"
  import { priceStore } from "$lib/stores/price"

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
      const { price } = JSON.parse(e.data)
      const num = Number(price)
      if (!Number.isNaN(num)) priceStore.set(num)
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
    connect($activeCoin)
  }

  onDestroy(() => es?.close())
</script>

<div class="stat w-full lg:w-1/3 bg-base-200 rounded-xl p-4 text-center">
  <div class="stat-title uppercase text-xs">Price</div>
  <div class="stat-value font-bold">
    {#if $priceStore !== null}
      {fmt($priceStore)}
    {:else}
      --
    {/if}
  </div>
</div>
