<script lang="ts">
  import { onMount, onDestroy } from "svelte"
  export let value = 0
  export let title = ""
  let container: HTMLDivElement
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let chart: any

  onMount(() => {
    // @ts-expect-error Highcharts is loaded globally
    chart = Highcharts.chart(container, {
      chart: { type: "solidgauge", height: "110%" },
      title: { text: title },
      tooltip: { enabled: false },
      pane: {
        startAngle: -90,
        endAngle: 90,
        background: {
          innerRadius: "60%",
          outerRadius: "100%",
          shape: "arc",
        },
      },
      yAxis: { min: 0, max: 100, lineWidth: 0, tickPositions: [] },
      series: [{ data: [value] }],
    })
  })

  $: if (chart) {
    chart.series[0].points[0].update(value)
    chart.setTitle({ text: title })
  }

  onDestroy(() => {
    chart && chart.destroy()
  })
</script>

<div bind:this={container} class="w-full h-60"></div>
