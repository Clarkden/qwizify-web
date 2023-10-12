<script lang="ts">
  import FlashCard from "$lib/components/PracticeTest.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { page } from "$app/stores";

  import { ArrowLeft } from "lucide-svelte";
  import { goto } from "$app/navigation";

  export let data: any;
  $: ({ flashCards } = data);
  $: ({ cards } = flashCards);

  // $: console.log(flashCards)
</script>

<section class="p-5 sm:mx-auto w-full sm:w-2/3 md:w-3/5">
  <Button
    variant="ghost"
    on:click={() => goto("/dashboard/flash-cards/" + $page.params.id)}
    class="flex flex-row gap-2 items-center"
    ><ArrowLeft class="w-5 h-5" /> Back</Button
  >
</section>
<section class="flex flex-col gap-3 p-5 mx-auto w-full sm:w-2/3 md:w-3/5">
  {#each cards as card}
    <FlashCard data={card} />
  {/each}
</section>
