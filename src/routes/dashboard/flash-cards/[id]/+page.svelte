<script lang="ts">
  import { goto } from "$app/navigation";
  import FlashCards from "$lib/components/FlashCards.svelte";
  import Practice from "$lib/components/PracticeTest.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Card from "$lib/components/ui/card";
  import { page } from "$app/stores";

  import { ArrowLeft } from "lucide-svelte";

  export let data: any;
  $: ({ flashCards } = data);
  $: ({ cards } = flashCards);
</script>

<section class="p-5 w-full sm:mx-auto sm:w-2/3 md:w-3/5">
  <Button
    variant="ghost"
    on:click={() => goto("/dashboard/" + $page.params.id)}
    class="flex flex-row gap-2 items-center"
    ><ArrowLeft class="w-5 h-5" /> Back</Button
  >
</section>
<section class="p-5 w-full mx-auto sm:w-2/3 md:w-3/5">
  <FlashCards data={flashCards} />
</section>
<section class="flex flex-col gap-3 p-5 mx-auto sm:w-2/3 md:w-3/5">
  <h2 class="font-bold text-xl">Note Cards In This Set</h2>
  {#each JSON.parse(cards) as card}
    <Card.Root
      class="border-secondary flex flex-col md:flex-row md:items-center divide-y-2 md:divide-x-2 md:divide-y-0 divide-secondary"
    >
      <Card.Header class="md:w-[50%] md:min-w-[50%] md:max-w-[50%]">
        <h1 class="font-bold">
          {card.question}
        </h1>
      </Card.Header>
      <Card.Content class="pt-4">
        <p class="text-muted-primary">
          {card.answers.find((data) => {
            return data.correctAnswer === true;
          }).answer}
        </p>
      </Card.Content>
    </Card.Root>
  {/each}
</section>
