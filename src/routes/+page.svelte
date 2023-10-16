<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
  import Scribble from "$lib/assets/images/Scribble.png";
  import FlashCardAnswer from "$lib/components/FlashCardAnswer.svelte";
  import {
    ArrowLeft,
    ArrowRight,
    IterationCw,
    CheckCircle2,
    Check,
    XCircle,
    Sun,
    Moon,
  } from "lucide-svelte";
  import * as RadioGroup from "$lib/components/ui/radio-group";
  import { Label } from "$lib/components/ui/label";
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import Logo from "$lib/assets/images/Logo.png";
  import { changeDarkMode, darkMode } from "$lib/stores/darkMode";

  let index = 0;
  $: displayIndex = index + 1;
  $: card = mockFlashCards[1];
  $: answers = card.answers;
  $: correctAnswer = answers.find((answer: any) => {
    return answer.correctAnswer === true;
  }).answer;

  let answerSubmitted: boolean;
  let chosenAnswer: string;
  let correct: boolean;

  let purchasingPlan: "yearly" | "monthly" = "monthly";

  let mockFlashCards = [
    {
      question: "What is the capital of the United States?",
      answers: [
        {
          answer: "Washington D.C.",
          correctAnswer: true,
        },
        {
          answer: "New York City",
          correctAnswer: false,
        },
        {
          answer: "Los Angeles",
          correctAnswer: false,
        },
        {
          answer: "Chicago",
          correctAnswer: false,
        },
      ],
    },
    {
      question: "Who is the greatest basketball player of all time?",
      answers: [
        {
          answer: "Michael Jordan",
          correctAnswer: false,
        },
        {
          answer: "Lebron James",
          correctAnswer: true,
        },
        {
          answer: "Kobe Bryant",
          correctAnswer: false,
        },
        {
          answer: "Kareem Abdul-Jabbar",
          correctAnswer: false,
        },
      ],
    },
    {
      question: "What is the best way study for a test?",
      answers: [
        {
          answer: "Qwizify",
          correctAnswer: true,
        },
        {
          answer: "Quizlet",
          correctAnswer: false,
        },
        {
          answer: "Anki",
          correctAnswer: false,
        },
        {
          answer: "Flash Cards",
          correctAnswer: false,
        },
      ],
    },
  ];

  const nextCard = () => {
    if (index === mockFlashCards.length - 1) {
      index = 0;
      return;
    }

    index++;
  };

  const previousCard = () => {
    if (index === 0) {
      index = mockFlashCards.length - 1;
      return;
    }

    index--;
  };

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

  onMount(() => {
    if (browser) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("opacity-0");
            // entry.target.classList.add("visible");
          }
        });
      });

      const hiddenElements = document.querySelectorAll(".opacity-0");

      hiddenElements.forEach((element) => {
        observer.observe(element);
      });
    }
  });
</script>

<svelte:head>
  <meta
    name="description"
    content="Qwizify is an AI study platform that turns your notes into study material in seconds."
  />
  <meta
    name="keywords"
    content="study, notes, flash cards, quiz, test, study material, study notes, study flash cards, study quiz, study test, study study material, study study notes, study study flash cards, study study quiz, study study test, study material material, study material notes, study material flash cards, study material quiz, study material test, study notes notes, study notes flash cards, study notes quiz, study notes test, study flash cards flash cards, study flash cards quiz, study flash cards test, study quiz quiz, study quiz test, study test test, study material material, study material notes, study material flash cards, study material quiz, study material test, study notes notes, study notes flash cards, study notes quiz, study notes test, study flash cards flash cards, study flash cards quiz, study flash cards test, study quiz quiz, study quiz test, study test test"
  />
  <meta name="author" content="Qwizify" />
  <title>Qwizify | Study Your Notes With AI</title>
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://qwizify.com" />
  <meta property="og:title" content="Qwizify | Study Your Notes With AI" />
  <meta
    property="og:description"
    content="Qwizify is an AI study platform that turns your notes into study material in seconds."
  />
  <meta property="og:image" content={Logo} />
  <meta property="og:site_name" content="Qwizify" />
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://qwizify.com" />
  <meta property="twitter:title" content="Qwizify | Study Your Notes With AI" />
  <meta
    property="twitter:description"
    content="Qwizify is an AI study platform that turns your notes into study material in seconds."
  />
</svelte:head>

<main class="pb-20 flex flex-col gap-10">
  <section
    class="h-16 w-full border-secondary border-b flex flex-row items-center justify-between px-5"
  >
    <nav class="flex flex-row items-center justify-between mx-auto w-full">
      <div>
        <!-- <img src={Logo} alt="Qwizify Logo" class="w-10 h-10" /> -->
        <a href="/" class="font-bold text-2xl"
          >Qwizify
          <span class="text-sm text-primary font-normal"> Beta </span>
        </a>
      </div>
      <div>
        <ul class="flex flex-row items-center gap-3">
          <!-- <li>
            <Button variant="outline" on:click={changeDarkMode}>
              {#if $darkMode}
                <Sun />
              {:else}
                <Moon />
              {/if}
            </Button>
          </li> -->
          <li>
            <Button href="/auth" variant="default">Start Studying</Button>
          </li>
        </ul>
      </div>
    </nav>
  </section>
  <section
    class="h-[80vh] w-full flex flex-col items-center justify-center gap-14"
  >
    <div>
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center">
        <span class="relative">
          Study
          <img
            src={Scribble}
            alt="scribble"
            class="absolute left-0 right-0 w-full"
          />
        </span>
        your notes with
        <span class="text-primary">AI</span>
      </h1>
    </div>
    <div class="flex flex-col gap-2 items-center">
      <p class="max-w-[400px] text-center mb-4 text-sm sm:text-base md:text-lg">
        Qwizify turns your notes into study material in seconds powered by GPT.
      </p>
      <div class="flex flex-row items-center gap-3">
        <Button href="/auth">Get Started</Button>
        <Button href="#learn" variant="outline">Learn More</Button>
      </div>
      <!-- <p class="text-sm font-light text-neutral-300 mt-4">Join and get 3 documents free</p> -->
    </div>
  </section>
  <section
    class="w-full h-16 bg-gradient-to-r from-transparent via-primary/25 to-transparent backdrop-blur-2xl flex flex-row items-center justify-center"
  >
    <p
      class="text-foreground-muted font-light flex flex-row gap-1 items-center"
    >
      <Check />
      Trusted by High School and College Students
    </p>
  </section>
  <section
    class="h-fit mx-auto w-11/12 sm:w-2/3 md:w-4/5 my-20 items-start justify-around grid gap-20 md:grid-cols-2 opacity-0 transition-all duration-1000"
  >
    <div class="flex justify-start items-center">
      <div class="flex flex-col gap-2">
        <h2 class="text-3xl font-bold">It's This Simple</h2>
        <p class="text-foreground-muted font-light">
          You can create a document in your dashboard and add your notes to it.
          Then, you can generate study material from your notes with the click
          of a button.
        </p>
        <div class="flex flex-row gap-3 mt-4">
          <Button href="/auth" variant="secondary">Start Studying</Button>
          <!-- <Button href="#learn" variant="outline">Learn More</Button> -->
        </div>
      </div>
    </div>
    <div
      class="grid grid-cols-1 grid-flow-row divide-y divide-secondary border border-secondary rounded-lg overflow-hidden shadow-primary/20 shadow-2xl"
    >
      <div
        class="h-fit col-span-1 transition p-5 relative z-50"
      >
        <div class="flex gap-2 items-center mb-2">
          <div
            class="rounded-full bg-neutral-700/25 w-6 h-6 text-white flex items-center justify-center"
          >
            <p class="font-bold">1</p>
          </div>
          <h4 class="text-xl font-bold">Create</h4>
        </div>
        <p>Create a new document in your dashboard</p>
      </div>

      <div
        class="h-fit col-span-1 transition p-5 relative z-50"
      >
        <div class="flex gap-2 items-center mb-2">
          <div
            class="rounded-full bg-neutral-700/25 w-6 h-6 text-white flex items-center justify-center"
          >
            <p class="font-bold">2</p>
          </div>
          <h4 class="text-xl font-bold">Add</h4>
        </div>
        <p>Add your notes to the document</p>
      </div>
      <div
        class="h-fit col-span-1 transition p-5 relative z-50"
      >
        <div class="flex gap-2 items-center mb-2">
          <div
            class="rounded-full bg-neutral-700/25 w-6 h-6 text-white flex items-center justify-center"
          >
            <p class="font-bold">3</p>
          </div>
          <h4 class="text-xl font-bold">Generate</h4>
        </div>
        <p>
          Generate study material from your notes with the click of a button
        </p>
      </div>
      <div
        class="h-fit col-span-1 transition p-5 relative z-50"
      >
        <div class="flex gap-2 items-center mb-2">
          <div
            class="rounded-full bg-neutral-700/25 w-6 h-6 text-white flex items-center justify-center"
          >
            <p class="font-bold">4</p>
          </div>
          <h4 class="text-xl font-bold">Study</h4>
        </div>
        <p>Study your notes with the generated study material</p>
      </div>
    </div>
  </section>
  <section
    class="h-fit mx-auto w-11/12 sm:w-2/3 md:w-4/5 my-20 items-start justify-around gap-20 flex flex-col-reverse md:flex-row"
  >
    <div
      class="grid grid-cols-1 grid-flow-row divide-y rounded-lg overflow-hidden shadow-primary/20 shadow-2xl w-full opacity-0 transition-all duration-1000"
    >
      <Card.Root class="border-secondary">
        <Card.Header class="flex flex-row items-center justify-between">
          <h1 class="font-bold text-2xl">Flash Cards</h1>
          <!-- <Button
            href={`/dashboard/flash-cards/${$page.params.id}/practice`}
            variant="secondary">Practice Test</Button
          > -->
        </Card.Header>
        <Card.Content>
          <FlashCardAnswer data={mockFlashCards[index]} />
        </Card.Content>

        <Card.Footer class="flex flex-row gap-3">
          <div class="flex flex-row gap-2 items-center">
            <Button
              on:click={previousCard}
              class="rounded-md w-16 h-10 p-2"
              variant="ghost"><ArrowLeft /></Button
            >
            <p class="w-6">{displayIndex + "/" + mockFlashCards.length}</p>
            <Button
              on:click={nextCard}
              class="rounded-md w-16 h-10 p-2"
              variant="ghost"><ArrowRight /></Button
            >
          </div>
        </Card.Footer>
      </Card.Root>
    </div>
    <div
      class="flex justify-start items-center w-full opacity-0 transition-all duration-1000"
    >
      <div class="flex flex-col gap-2">
        <h2 class="text-3xl font-bold">Generate Flash Cards</h2>
        <p class="text-foreground-muted font-light">
          No need to manually create flash cards. Qwizify will generate flash
          cards for you from your notes as well as a practice quiz for each set
          of flash cards.
        </p>
        <div class="flex flex-row gap-3 mt-4">
          <Button href="/auth" variant="secondary">Create Flash Cards</Button>
          <!-- <Button href="#learn" variant="outline">Learn More</Button> -->
        </div>
      </div>
    </div>
  </section>
  <section
    class="h-fit mx-auto w-11/12 sm:w-2/3 md:w-4/5 my-20 items-start justify-around grid gap-20 md:grid-cols-2"
  >
    <div
      class="flex justify-start items-center opacity-0 transition-all duration-1000"
    >
      <div class="flex flex-col gap-2">
        <h2 class="text-3xl font-bold">Practice Your Expertise</h2>
        <p class="text-foreground-muted font-light">
          Qwizify will generate a practice test for each set of flash cards you
          create. You can practice your expertise and test your knowledge with
          the practice test.
        </p>
        <div class="flex flex-row gap-3 mt-4">
          <Button href="/auth" variant="secondary">Practice Now</Button>
          <!-- <Button href="#learn" variant="outline">Learn More</Button> -->
        </div>
      </div>
    </div>
    <div
      class="grid grid-cols-1 grid-flow-row divide-y rounded-lg overflow-hidden shadow-primary/20 shadow-2xl opacity-0 transition-all duration-1000"
    >
      <Card.Root
        class={answerSubmitted
          ? correct
            ? "border-primary"
            : "border-red-400"
          : "bg-card border-secondary text-card-foreground"}
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
    </div>
  </section>
  <section class="h-fit mx-auto w-11/12 sm:w-2/3 md:w-3/5 my-40">
    <!-- Pricing section with the header simple pricing with two pricing options -->
    <div
      class="flex flex-col gap-3 justify-center items-center opacity-0 transition-all duration-1000 w-full"
    >
      <h2 class="text-3xl font-bold">Simple Pricing</h2>
      <div class="flex flex-row gap-2">
        <p>Monthly</p>
        <button
          on:click={() => {
            if (purchasingPlan === "monthly") {
              purchasingPlan = "yearly";
            } else {
              purchasingPlan = "monthly";
            }
          }}
          class={`w-12 h-6 ${
            purchasingPlan === "yearly"
              ? "bg-blue-300 justify-end"
              : "bg-neutral-600 justify-start"
          } flex flex-row  rounded-full items-center`}
        >
          <div class="w-6 h-6 bg-primary rounded-full" />
        </button>
        <p>Yearly</p>
      </div>
    </div>
    <div
      class="flex flex-col md:flex-row items-start justify-center gap-10 mt-10 opacity-0 transition-all duration-1000"
    >
      <div
        class="h-fit w-full md:max-w-[350px] md:w-[350px] col-span-1 border rounded-lg transition p-5 relative z-50 bg-card border-secondary"
      >
        <h4 class="text-xl font-bold mb-4">Free</h4>
        <p class="text-neutral-400 mb-6">Perfect for testing out Qwizify</p>
        <div
          class="text-sm text-foreground-muted divide-y mt-5 divide-neutral-500"
        >
          <p class="py-3 flex flex-row items-center gap-2">
            <CheckCircle2 class="w-5 h-5 text-primary" />
            Unlimited Documents
          </p>
          <p class="py-3 flex flex-row items-center gap-2">
            <CheckCircle2 class="w-5 h-5 text-primary" />
            Flash Cards
          </p>
          <p class="py-3 flex flex-row items-center gap-2">
            <XCircle class="w-5 h-5 text-slate-400" />
            AI Powered Flash Cards
          </p>
          <p class="py-3 flex flex-row items-center gap-2">
            <XCircle class="w-5 h-5 text-slate-400" />
            AI Practice Tests
          </p>
          <p class="py-3 flex flex-row items-center gap-2">
            <XCircle class="w-5 h-5 text-slate-400" />
            AI Tutor
          </p>
        </div>
        <Button href="/auth" class="mt-4" variant="outline">Get Started</Button>
      </div>

      <div
        class="h-fit w-full md:max-w-[350px] md:w-[350px] col-span-1 border rounded-lg transition p-5 relative z-50 bg-card border-secondary"
      >
        <h4 class="text-xl font-bold mb-4">
          {#if purchasingPlan === "monthly"}
            Monthly
          {:else if purchasingPlan === "yearly"}
            Yearly
          {/if}
        </h4>
        <p class="text-neutral-400 mb-6">Get everything Qwizify has to offer</p>
        <p>
          <span class="text-2xl font-bold">
            {#if purchasingPlan === "monthly"}
              $2.99
            {:else if purchasingPlan === "yearly"}
              $29.99
            {/if}
          </span>
          <span class="text-sm text-foreground-muted">
            {#if purchasingPlan === "monthly"}
              per month
            {:else if purchasingPlan === "yearly"}
              per year
            {/if}
          </span>
        </p>
        <div
          class="text-sm text-foreground-muted divide-y mt-5 divide-neutral-500"
        >
          <p class="py-3 flex flex-row items-center gap-2">
            <CheckCircle2 class="w-5 h-5 text-primary" />
            Unlimited Documents
          </p>
          <p class="py-3 flex flex-row items-center gap-2">
            <CheckCircle2 class="w-5 h-5 text-primary" />
            Flash Cards
          </p>
          <p class="py-3 flex flex-row items-center gap-2">
            <CheckCircle2 class="w-5 h-5 text-primary" />
            AI Powered Flash Cards
          </p>
          <p class="py-3 flex flex-row items-center gap-2">
            <CheckCircle2 class="w-5 h-5 text-primary" />
            AI Practice Tests
          </p>
          <p class="py-3 flex flex-row items-center gap-2">
            <CheckCircle2 class="w-5 h-5 text-primary" />
            AI Tutor
          </p>
        </div>
        <Button href="/auth" class="mt-4" variant="outline">Get Started</Button>
      </div>
    </div>
  </section>
</main>
<footer class="h-64 bg-neutral-900 flex flex-col p-10 justify-between text-white">
  <div class="flex flex-row justify-between">
    <div class="flex flex-col gap-1">
      <a href="/" class="flex flex-row justify-start items-baseline gap-1">
        <p class="font-bold text-2xl text-white">Qwizify</p>
        <p class="text-sm text-primary">Beta</p>
      </a>
      <p class="text-sm text-foreground-muted">The AI study platform</p>
    </div>
  </div>
  <div class=" py-3 text-sm text-foreground-muted">
    2023 Qwizify. All rights reserved.
  </div>
</footer>
