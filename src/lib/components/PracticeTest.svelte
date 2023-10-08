<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import { onMount } from "svelte";
  import * as RadioGroup from "$lib/components/ui/radio-group";
  import { Label } from "$lib/components/ui/label";
  import Button from "./ui/button/button.svelte";
  import { IterationCw } from "lucide-svelte";
  import { fade } from "svelte/transition";

  export let data: any;
  $: card = data;
  $: answers = card.answers;
  $: correctAnswer = answers.find((answer: any) => {
    return answer.correctAnswer === true;
  }).answer;

  let answerSubmitted: boolean;
  let chosenAnswer: string;
  let correct: boolean;

  onMount(() => {
    // Shuffle answers randomly
    answers = card.answers.sort(() => Math.random() - 0.5);
  });

  const submitAnswer = () => {
    answerSubmitted = true;
    console.log(chosenAnswer, correctAnswer);
    if (chosenAnswer === correctAnswer) {
      correct = true;
    } else {
      correct = false;
    }
  };

  const reset = () => {
    answerSubmitted = false;
    chosenAnswer = "";
    correct = false;
  };
</script>

<Card.Root
  class={answerSubmitted
    ? correct
      ? "border-primary"
      : "border-red-400"
    : "border-secondary"}
>
  <Card.Header>
    {card.question}
  </Card.Header>
  <Card.Content>
    <RadioGroup.Root bind:value={chosenAnswer}>
      {#each answers as answer (answer)}
        <div
          class={`flex items-center space-x-2 ${
            answerSubmitted
              ? "pointer-events-none opacity-50"
              : "pointer-events-auto"
          }`}
        >
          <RadioGroup.Item value={answer.answer} id="r1" />
          <Label for="r1">{answer.answer}</Label>
        </div>
      {/each}
    </RadioGroup.Root>

    {#if chosenAnswer && !answerSubmitted}
      <div in:fade>
        <Button variant="default" class="mt-5" on:click={submitAnswer}>
          Submit
        </Button>
      </div>
    {:else if chosenAnswer && answerSubmitted && !correct}
      <div in:fade>
        <Button
          variant="outline"
          class="mt-5 flex flex-row gap-2"
          on:click={reset}
        >
          <IterationCw class="w-4 h-4" />
          Retry
        </Button>
      </div>
    {/if}

    <!-- <div class="flex flex-row items-center gap-3">
      <input type="radio" name={card.question} value={answer} />
      <span>{answer.answer}</span>
    </div> -->
  </Card.Content>
</Card.Root>
