<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import FlashCardAnswer from "./FlashCardAnswer.svelte";
  import Button from "./ui/button/button.svelte";
  import { ArrowLeft, ArrowRight } from "lucide-svelte";
  import { answerState } from "$lib/stores/flashcardanswer";
  import { page } from "$app/stores";

  export let data: any;
  $: cards = JSON.parse(data.cards);

  let index = 0;
  $: displayIndex = index + 1;

  const nextCard = () => {
    answerState.set(false);

    if (index === cards.length - 1) {
      index = 0;
      return;
    }

    index++;
  };

  const previousCard = () => {
    answerState.set(false);

    if (index === 0) {
      index = cards.length - 1;
      return;
    }

    index--;
  };
</script>

<div class="w-full">
  <Card.Root class="border-secondary">
    <Card.Header class="flex flex-row items-center justify-between">
      <h1 class="font-bold text-2xl">Flash Cards</h1>
      <Button
        href={`/dashboard/flash-cards/${$page.params.id}/practice`}
        variant="secondary">Practice Test</Button
      >
    </Card.Header>
    <Card.Content>
      <FlashCardAnswer data={cards[index]} />
    </Card.Content>

    <Card.Footer class="flex flex-row gap-3">
      <div class="flex flex-row gap-2 items-center">
        <Button
          on:click={previousCard}
          class="rounded-md w-16 h-10 p-2"
          variant="ghost"><ArrowLeft /></Button
        >
        <p class="w-6">{displayIndex + "/" + cards.length}</p>
        <Button
          on:click={nextCard}
          class="rounded-md w-16 h-10 p-2"
          variant="ghost"><ArrowRight /></Button
        >
      </div>
    </Card.Footer>
  </Card.Root>
</div>
