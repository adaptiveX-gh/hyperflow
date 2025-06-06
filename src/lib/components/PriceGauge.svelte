<script lang="ts">
  /* Highcharts wrapper ------------------------------------------- */
  import Highcharts from "highcharts"
  import solidGauge from "highcharts/modules/solid-gauge"
  import Chart from "@highcharts/svelte"
  solidGauge(Highcharts)

  /* public props -------------------------------------------------- */
  export let price = 0 // current mark-price
  export let hi = 1 // 24-h high
  export let lo = 0 // 24-h low

  /* derived % position in range ---------------------------------- */
  $: pct = hi === lo ? 0 : ((price - lo) / (hi - lo)) * 100

  /* declare options first, then keep it reactive ----------------- */
  let options: Highcharts.Options

  $: options = {
    chart: { type: "solidgauge", backgroundColor: "transparent" },
    title: { text: `BTC ${price.toLocaleString()}` },
    credits: { enabled: false },
    tooltip: { enabled: false },

    pane: {
      startAngle: -90,
      endAngle: 90,
      background: [{ innerRadius: "60%", outerRadius: "100%", shape: "arc" }],
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
</script>

<!-- render only in the browser so SSR never runs Highcharts -------->
{#if typeof window !== "undefined"}
  <Chart highcharts={Highcharts} {options} />
{:else}
  <!-- SSR fallback (removed after hydration) -->
  <div class="h-56 w-full flex items-center justify-center text-xs opacity-60">
    Loading gauge…
  </div>
{/if}
