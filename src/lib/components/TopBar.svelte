<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { activeCoin, streamRunning } from "$lib/stores/streams"

  const coins = ["BTC-PERP", "ETH-PERP"]

  const dispatch = createEventDispatcher()

  async function startStreams(coin: string) {
    await fetch("/api/startFlow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coin }),
    })
    streamRunning.set(true)
    dispatch("start", { coin })
  }

  async function stopStreams() {
    await fetch("/api/stopFlow", { method: "POST" })
    streamRunning.set(false)
    dispatch("stop")
  }

  function selectCoin(coin: string) {
    activeCoin.update((prev) => {
      if (prev !== coin) {
        streamRunning.update((running) => {
          if (running) {
            stopStreams().then(() => startStreams(coin))
          }
          return running
        })
      }
      return coin
    })
  }
</script>

<nav
  class="navbar bg-base-300 text-base-content fixed top-0 left-0 right-0 z-50 px-4 h-12"
>
  <div class="flex items-center gap-2">
    <span class="text-lg">☆</span>
    <div class="dropdown">
      <button type="button" class="cursor-pointer uppercase font-bold">
        {$activeCoin.split("-")[0]}
        <svg
          class="inline w-3 h-3 ml-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M5.23 7.21L10 12l4.77-4.79-1.42-1.42L10 9.17 6.65 5.79z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
      <ul class="dropdown-content menu p-2 bg-base-200 shadow rounded-box w-40">
        {#each coins as coin}
          <li>
            <button type="button" on:click={() => selectCoin(coin)}
              >{coin}</button
            >
          </li>
        {/each}
      </ul>
    </div>
  </div>

  <div class="flex-1 flex justify-center gap-6 text-sm opacity-70 select-none">
    <span>24h Vol --</span>
    <span>OI --</span>
    <span>Funding --</span>
  </div>

  <div class="flex-none">
    {#if $streamRunning}
      <button class="btn btn-error btn-sm" on:click={stopStreams}
        >Stop Streams</button
      >
    {:else}
      <button
        class="btn btn-primary btn-sm"
        on:click={() => startStreams($activeCoin)}>Start Streams</button
      >
    {/if}
  </div>
</nav>

<style>
  :global(body) {
    padding-top: 3rem;
  }
</style>
