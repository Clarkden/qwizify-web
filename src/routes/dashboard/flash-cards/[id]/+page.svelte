<script lang="ts">
  import { goto } from "$app/navigation";
  import FlashCards from "$lib/components/FlashCards.svelte";
  import Practice from "$lib/components/PracticeTest.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Card from "$lib/components/ui/card";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { page } from "$app/stores";
  import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";

  import {
    ArrowLeft,
    Loader2,
    Minus,
    MoreHorizontal,
    Plus,
    RotateCw,
  } from "lucide-svelte";
  import { onMount } from "svelte";
  import { PUBLIC_SERVER_URL, PUBLIC_WEBSOCKET_URL } from "$env/static/public";
  import Input from "$lib/components/ui/input/input.svelte";
  // import { WebSocket } from "vite";

  export let data: any;
  $: ({ flashCards, session } = data);

  let cards: {
    question: string;
    answers: { answer: string; correctAnswer: boolean }[];
  }[] = [];
  let loading: "idle" | "streaming" | "error" = "idle";

  let addingCards: boolean = false;
  let newCard = {
    question: "",
    answer: "",
  };
  let webSocketResponse = "";

  const isJson = (item: string) => {
    let value = typeof item !== "string" ? JSON.stringify(item) : item;
    try {
      value = JSON.parse(value);
    } catch (e) {
      return false;
    }

    return typeof value === "object" && value !== null;
  };

  const loadNewFlashCards = async () => {
    loading = "streaming";
    try {
      const response = await fetch(
        `${PUBLIC_SERVER_URL}/document/flash-cards`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
          },
          body: JSON.stringify({
            documentId: $page.params.id,
          }),
        }
      );

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let object = "";

      while (true) {
        const { done, value } = await reader.read();
        // console.log(done, value)
        const decodedChunk = decoder.decode(value);

        let character = decodedChunk;

        object += decodedChunk;

        if (done) {
          loading = "idle";

          if (!isJson(object)) {
            loading = "error";
            break;
          }

          cards = JSON.parse(object);

          break;
        }
      }
    } catch (error) {
      console.log(error);
      loading = "error";
    }
  };

  const saveNewCard = async () => {
    try {
      const response = await fetch(
        `${PUBLIC_SERVER_URL}/document/flash-cards/new-card`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
          },
          body: JSON.stringify({
            documentId: $page.params.id,
            answer: newCard.answer,
            question: newCard.question,
          }),
        }
      );
    } catch (error) {
      console.log(error);
    } finally {
      addingCards = false;
      newCard = {
        question: "",
        answer: "",
      };
    }
  };

  const fetchFlashCards = async () => {
    try {
      const response = await fetch(
        `${PUBLIC_SERVER_URL}/document/flash-cards/${$page.params.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      );

      const data = await response.json();

      cards = data.cards;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAll = async () => {
    try {
      const response = await fetch(
        `${PUBLIC_SERVER_URL}/document/flash-cards/${$page.params.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      );

      window.location.href = "/dashboard/" + $page.params.id;
    } catch (error) {
      console.log(error);
    }
  };

  onMount(async () => {
    if (!flashCards.cards) {
      await loadNewFlashCards();
    } else {
      cards = flashCards.cards;
      // loading = "idle"
    }

    // const websocket = new WebSocket(`${PUBLIC_WEBSOCKET_URL}/`);

    // // console.log(websocket);

    // websocket.addEventListener("open", () => {
    //   console.log("connected");
    //   // websocket.send("Hello");
    // });

    // websocket.addEventListener("message", (event) => {
    //   webSocketResponse += event.data
    // });

    // websocket.addEventListener("close", () => {
    //   console.log("disconnected");
    // });
  });
</script>

<!-- {webSocketResponse} -->
<div
  class="col-span-1 sm:col-span-2 md:col-span-4 lg:col-span-6 overflow-y-auto overflow-x-hidden"
>
  <section
    class="p-5 w-full sm:mx-auto sm:w-2/3 md:w-3/5 flex flex-row items-center justify-between"
  >
    <Button
      variant="ghost"
      on:click={() => goto("/dashboard/" + $page.params.id)}
      class="flex flex-row gap-2 items-center"
      ><ArrowLeft class="w-5 h-5" /> Back</Button
    >
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild let:builder>
        <Button builders={[builder]} variant="ghost">
          <MoreHorizontal />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content class="w-56 border-secondary">
        <!-- <DropdownMenu.Label>Options</DropdownMenu.Label>
    <DropdownMenu.Separator /> -->
        <DropdownMenu.Group>
          <DropdownMenu.Item on:click={deleteAll}>Delete</DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </section>
  {#if loading !== "error"}
    {#if loading === "streaming"}
      <section class="p-5 w-full sm:mx-auto sm:w-2/3 md:w-3/5">
        <Loader2 class="animate-spin w-10 h-10 mx-auto" />
      </section>
    {/if}
    <section class="p-5 w-full mx-auto sm:w-2/3 md:w-3/5">
      <FlashCards data={{ cards, loading }} />
    </section>
    <section class="flex flex-col gap-3 p-5 mx-auto w-full sm:w-2/3 md:w-3/5">
      <div class="flex flex-row justify-between">
        <h2 class="font-bold text-xl">Note Cards In This Set</h2>
        <Button
          variant="secondary"
          class="flex flex-row gap-2"
          on:click={() => {
            addingCards = !addingCards;
          }}
        >
          {#if !addingCards}
            <Plus /> Add Cards
          {:else}
            <Minus /> Cancel
          {/if}
        </Button>
      </div>
      {#if addingCards}
        <Card.Root
          class="border-secondary flex flex-col md:flex-row md:items-center divide-y-2 md:divide-x-2 md:divide-y-0 divide-secondary"
        >
          <Card.Content class="pt-4 flex flex-col gap-2 w-full">
            <Input bind:value={newCard.question} placeholder="Question" />
            <Input bind:value={newCard.answer} placeholder="Answer" />
            <Button
              variant="secondary"
              class="flex flex-row gap-2"
              on:click={async () => {
                await saveNewCard();
                await fetchFlashCards();
              }}
            >
              Save
            </Button>
          </Card.Content>
        </Card.Root>
      {/if}
      {#if cards.length > 0}
        {#each cards as card}
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
      {/if}
      {#if loading === "streaming"}
        <!--  Skeleton loading ui -->
        <Skeleton class="w-full h-20" />
      {/if}
    </section>
  {:else}
    <section class="p-5 w-full sm:mx-auto sm:w-2/3 md:w-3/5">
      <h1 class="font-bold text-xl">Uh Oh</h1>
      <p class="text-muted-primary">
        Something went wrong while generating your flash cards. Please try again
      </p>
      <Button variant="outline" on:click={loadNewFlashCards} class="mt-3">
        <RotateCw class="w-5 h-5 mr-2" />
        Try Again</Button
      >
    </section>
  {/if}
</div>
