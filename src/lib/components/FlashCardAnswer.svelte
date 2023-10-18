<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { answerState } from "$lib/stores/documents";
  import { slide } from "svelte/transition";

  export let data: any;
  $: ({ question, answers } = data);
  $: correctAnswer = answers.find(
    (answer: { correctAnswer: boolean; answer: string }) => {
      return answer.correctAnswer === true;
    }
  ).answer;
</script>

<div class="border border-secondary rounded-md p-5 bg-background">
  <h2 class="font-bold">{question}</h2>
  {#if $answerState}
    <div transition:slide class="pt-4">
      <p class="text-muted-primary">
        {correctAnswer}
      </p>
    </div>
  {/if}
</div>
<Button
  on:click={() => {
    answerState.set(!$answerState);
  }}
  variant="default"
  class="mt-4"
>
  {#if $answerState}
    Hide Answer
  {:else}
    Show Answer
  {/if}
</Button>
