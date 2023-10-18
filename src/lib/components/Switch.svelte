<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let state: any;

  const dispatch = createEventDispatcher();

  const switchState = async () => {
    dispatch("switch");
  };
</script>

<button
  class={`w-10 h-6 p-1 rounded-full relative ${
    state ? "bg-primary" : "bg-neutral-900"
  }`}
  on:click={() => {
    state = !state;
    switchState();
  }}
>
  <div
    class={`h-4 w-4 rounded-full bg-white absolute translate-transform ${
      state ? "left-1/2" : "right-1/2"
    } top-1/2 -translate-y-1/2`}
  />
</button>
