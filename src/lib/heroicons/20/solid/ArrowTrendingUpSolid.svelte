<script lang="ts">
  export let className: string = ""
  export { className as class }
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 20 20"
  fill="currentColor"
  {...$$restProps}
  class={className}
>
  <path
    d="M2.25 17.25a.75.75 0 01-.75-.75v-5a.75.75 0 011.5 0v3.19l6.72-6.72a.75.75 0 011.06 0l3.97 3.97V10a.75.75 0 011.5 0v6a.75.75 0 01-.75.75h-6a.75.75 0 010-1.5h3.19l-3.44-3.44-6.28 6.28H7a.75.75 0 010 1.5H2.25z"
  />
</svg>
