<script lang="ts">
  import Navbar from "$lib/components/Navbar.svelte";

  export let data: any;

  $: ({ doc } = data);
  $: ({ title, content } = doc);
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<Navbar />
<div
  class="flex-1 bg-white drop-shadow overflow-y-auto m-2 ml-2 mr-2 mb-0 rounded-t-xl relative transition-all"
>
  <div class="flex-1 flex flex-row gap-3 min-h-screen h-fit bg-white mt-20">
    <div class="max-w-[1600px] w-full mx-auto h-fit">
      <h1 class="font-bold text-3xl">
        {title}
      </h1>
      <div class="sharedEditor">
        {@html content}
      </div>
    </div>
  </div>
</div>
