<!--  src/lib/components/PriceGauge.svelte
     Solid-gauge widget: shows where `price` sits inside the
     24 h range [`lo` … `hi`].  Requires `pnpm add highcharts`.
-->

<script lang="ts">
  /* --- Highcharts (bundled locally via Vite) --------------------- */
  import Highcharts from "highcharts"
  import SolidGauge from "highcharts/modules/solid-gauge"
  SolidGauge(Highcharts) // activate the gauge module

  /* --- public props --------------------------------------------- */
  export let price = 0 // current mark-price
  export let hi = 1 // 24 h high
  export let lo = 0 // 24 h low

  /* --- internals ------------------------------------------------- */
  import { onMount, onDestroy } from "svelte"
  let chartEl: HTMLDivElement
  let chart: Highcharts.Chart | undefined

  /* derived percentage (0–100) */
  $: pct = hi === lo ? 0 : ((price - lo) / (hi - lo)) * 100

  /* live-update whenever price / range changes */
  $: if (chart && chart.series[0].points[0]) {
    chart.series[0].points[0].update(pct, true)
    chart.setTitle({ text: `BTC ${price.toLocaleString()}` })
  }

  /* one-time render */
  onMount(() => {
    chart = Highcharts.chart({
      chart: {
        type: "solidgauge",
        backgroundColor: "transparent",
        renderTo: chartEl,
      },
      title: {
        text: `BTC ${price.toLocaleString()}`,
        style: { fontSize: "1rem" },
      },
      credits: { enabled: false },

      pane: {
        startAngle: -90,
        endAngle: 90,
        background: [
          {
            innerRadius: "60%",
            outerRadius: "100%",
            shape: "arc",
            borderWidth: 0,
            borderColor: "transparent",
          },
        ],
      },

      yAxis: {
        min: 0,
        max: 100,
        lineWidth: 0,
        tickPositions: [],
      },

      tooltip: { enabled: false },

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
    })
  })

  onDestroy(() => chart?.destroy())
</script>

<!-- container takes parent’s width, fixed height -->
<div bind:this={chartEl} class="h-56 w-full"></div>

<style>
  /* optional: dark-friendly foreground */
  :global(.highcharts-title) {
    fill: currentColor;
    color: currentColor;
  }
  :global(.highcharts-background) {
    fill: transparent;
  }
</style>
