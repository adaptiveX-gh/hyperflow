<!--  src/lib/components/PriceGauge.svelte  -->
<script lang="ts">
  import { onMount } from "svelte"
  import { browser } from "$app/environment"

  /* public props -------------------------------------------------- */
  export let price = 0
  export let hi = 1
  export let lo = 0

  /* reactive % position ------------------------------------------ */
  $: pct = hi === lo ? 0 : ((price - lo) / (hi - lo)) * 100

  /* placeholders filled in the browser --------------------------- */
  let Highcharts: typeof import("highcharts") | undefined = undefined
  let ChartComp: typeof import("@highcharts/svelte").default | null = null
  let options: Highcharts.Options | undefined

  /* browser-only setup ------------------------------------------- */
  onMount(async () => {
    if (!browser) return // SSR -> skip

    /* 1 · dynamic imports in correct order */
    Highcharts = (await import("highcharts")).default
    await import("highcharts/highcharts-more")
    await import("highcharts/modules/solid-gauge")

    /* 2 · import the Svelte wrapper last */
    ChartComp = (await import("@highcharts/svelte")).default

    /* 3 · initial options */
    updateOptions()
  })

  /* helper to rebuild options when props change */
  function updateOptions() {
    if (!Highcharts) return
    options = {
      chart: { type: "solidgauge", backgroundColor: "transparent" },
      title: { text: `BTC ${price.toLocaleString()}` },
      credits: { enabled: false },
      tooltip: { enabled: false },
      pane: {
        startAngle: -90,
        endAngle: 90,
        background: [
          {
            innerRadius: "60%",
            outerRadius: "100%",
            shape: "arc",
          },
        ],
      },
      yAxis: { min: 0, max: 100, tickPositions: [] },
      series: [
        {
          type: "solidgauge",
          data: [pct],
          rounded: true,
          radius: "100%",
          innerRadius: "60%",
          dataLabels: { enabled: false },
        },
      ],
    }
  }

  /* keep options reactive --------------------------------------- */
  $: updateOptions()
</script>

<!-- render only after browser has loaded Highcharts + wrapper -->
{#if ChartComp && options}
  <svelte:component this={ChartComp} highcharts={Highcharts} {options} />
{:else}
  <!-- SSR fallback / loading -->
  <div class="h-56 w-full flex items-center justify-center text-xs opacity-60">
    Loading gauge…
  </div>
{/if}
