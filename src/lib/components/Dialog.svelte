<script lang="ts">
  import { fade } from "svelte/transition";
</script>

<div
  class="absolute top-0 left-0 bg-black/40 w-full h-full flex flex-col items-center justify-center overflow-hidden z-50 p-5"
  in:fade={{ duration: 200 }}
>
  <div class="bg-white p-5 rounded md:min-w-[300px]">
    <slot />
  </div>
</div>
