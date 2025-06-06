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
    d="M17.75 2.75a.75.75 0 00-.75-.75h-6a.75.75 0 000 1.5h3.19l-6.28 6.28-3.44-3.44A.75.75 0 003.41 7.3l3.97 3.97-6.72 6.72V14a.75.75 0 10-1.5 0v5a.75.75 0 00.75.75h5a.75.75 0 000-1.5H4.56l6.72-6.72a.75.75 0 011.06 0l3.44 3.44 6.28-6.28V10a.75.75 0 001.5 0v-6z"
  />
</svg>
