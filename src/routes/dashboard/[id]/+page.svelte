<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import {
    ArrowLeft,
    FileText,
    Loader2,
    Menu,
    MoreHorizontal,
  } from "lucide-svelte";
  import { onDestroy, onMount } from "svelte";
  import { PUBLIC_SERVER_URL } from "$env/static/public";
  import { goto } from "$app/navigation";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { EditorTheme, SvelteEditor } from "@nextlint/svelte";
  import type { Editor } from "@tiptap/core";
  import { navigating } from "$app/stores";
  import { deletedDocument, documentTitleUpdate } from "$lib/stores/documents";
  import * as Card from "$lib/components/ui/card";
  import { browser } from "$app/environment";
  // import { flashCardSidebar } from "$lib/stores/documents";
  import { blur, fade, fly, slide } from "svelte/transition";

  export let data: any;
  $: ({ doc, session, user } = data);
  $: ({ flashCards } = doc);
  $: result = "";

  let loading: "idle" | "error" | "loading" = "idle";
  let flashCardsStatus: "idle" | "error" | "loading" = "idle";
  let editor: Editor;
  let flashCardSidebar = false;

  const submitPromt = async (prompt: string): Promise<string> => {
    try {
      const response = await fetch(`${PUBLIC_SERVER_URL}/document/gpt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
        body: JSON.stringify({
          query: `{sveltor_completion(prompt:"${prompt}"){text}}`,
        }),
      });

      const data = await response.json();

      if (data?.sveltor_completion) {
        return data.sveltor_completion[0].text.trim();
      }
      return "";
    } catch (error) {
      console.log(error);
    }
    return "";
  };

  const handleUpload = async (file: File) => {
    // handle upload here
    const blob = new Blob([file]);
    const previewUrl = URL.createObjectURL(blob);
    return previewUrl;
  };

  const saveDoc = async () => {
    try {
      const response = await fetch(`${PUBLIC_SERVER_URL}/document/` + doc.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
        body: JSON.stringify({
          title: doc.title,
          content: editor && editor.getHTML(),
          text: editor && editor.getText(),
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const isJson = (item: string) => {
    let value = typeof item !== "string" ? JSON.stringify(item) : item;
    try {
      value = JSON.parse(value);
    } catch (e) {
      return false;
    }

    return typeof value === "object" && value !== null;
  };

  const createFlashCards = async () => {
    // loading = "loading";

    try {
      await saveDoc();
      // window.location.href = "/dashboard/flash-cards/" + doc.id;

      flashCardsStatus = "loading";
      const response = await fetch(
        `${PUBLIC_SERVER_URL}/document/flash-cards`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
          },
          body: JSON.stringify({
            documentId: doc.id,
          }),
        }
      );

      const reader = response?.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      let object = "";

      while (true) {
        const { done, value } = await reader!.read();
        // console.log(done, value)
        const decodedChunk = decoder.decode(value);

        let character = decodedChunk;

        object += decodedChunk;
        result += decodedChunk;

        if (done) {
          console.log("done streaming");
          flashCardsStatus = "idle";

          console.log("checking if json");

          if (!isJson(object)) {
            console.log("not json");

            flashCardsStatus = "error";
            break;
          }

          console.log("json");

          let cards = JSON.parse(object);

          if (Array.isArray(cards)) {
            flashCards.cards = cards;
          } else {
            flashCards.cards = [cards];
          }

          break;
        }
      }
    } catch (error) {
      console.log(error);
      loading = "error";
    }
  };

  const deleteDoc = async () => {
    try {
      const response = await fetch(`${PUBLIC_SERVER_URL}/document/` + doc.id, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session}`,
        },
      });

      deletedDocument.set(true);

      goto("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  $: if ($navigating) saveDoc();

  onMount(() => {
    if (browser) {
      let prose = document.querySelector("ProseMirror");
      prose?.classList.add("!text-white bg-red-400");
    }
  });

  onDestroy(() => {
    saveDoc();
    console.log("doc saved");
  });

  $: if (browser) {
    if (flashCardSidebar) {
      document.getElementById("editor")?.classList.remove("lg:col-span-6");
      document.getElementById("editor")?.classList.add("lg:col-span-4");
    } else {
      setTimeout(() => {
        document.getElementById("editor")?.classList.remove("lg:col-span-4");
        document.getElementById("editor")?.classList.add("lg:col-span-6");
      }, 300);
    }
  }
</script>

<!-- {result} -->
<div
  id="editor"
  class="col-span-1 sm:col-span-3 md:col-span-2 lg:col-span-6 overflow-y-auto overflow-x-hidden"
>
  <section class="section p-5 px-10 w-full flex flex-col gap-5 flex-1">
    <div
      class="flex flex-col md:flex-row gap-4 md:justify-between md:items-center"
    >
      <FileText class="w-5 h-5 min-w-[20px] mr-2" />
      <input
        placeholder="Title"
        class="outline-none py-2 text-2xl font-bold w-full bg-transparent"
        bind:value={doc.title}
        on:input={() => {
          // console.log($documentTitleUpdate);
          documentTitleUpdate.set({ id: doc.id, title: doc.title });
        }}
      />
      <div class="flex flex-row items-center gap-3 w-full md:w-fit">
        <!-- {#if doc.flashCards}
          <Button
            variant="default"
            href={"/dashboard/flash-cards/" + doc.id}
            class="md:w-[auto] w-full">View Flash Cards</Button
          >
          <Button
          variant="default"
          href={"/dashboard/flash-cards/" + doc.id + "/practice"}
          class="md:w-[auto] w-full">Practice Test</Button
        >
        {:else if loading === "loading"}
          <Button variant="outline" class="md:w-[auto] w-full">
            <Loader2 class="w-5 h-5 animate-spin" />
          </Button>
        {:else if loading === "error"}
          <Button variant="destructive" disabled class="md:w-[auto] w-full">
            <p class="text-red-500">Error</p>
          </Button>
        {:else if loading === "idle"}
          <Button
          variant="secondary"
          on:click={saveDoc}
          class="md:w-[auto] w-full">Save</Button
        >
          <button class="md:w-[auto] w-full" on:click={createFlashCards}>
            <p class="text-accent">Create Flash Cards</p>
          </button>

          <Button
            variant="default"
            on:click={createFlashCards}
            class="md:w-[auto] w-full">Create Flash Cards</Button
          >
        {/if} -->
        {#if user.plan !== "free" || user.role === "admin"}
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
                <DropdownMenu.Item on:click={deleteDoc}
                  >Delete</DropdownMenu.Item
                >
              </DropdownMenu.Group>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        {/if}
        <Button
          variant="ghost"
          on:click={() => {
            flashCardSidebar = !flashCardSidebar;

          }}
        >
          <Menu class="hidden md:block" />
        </Button>
      </div>
    </div>
    <!-- <div class="editor"> -->
    <div class="!text-white">
      <EditorTheme
        override={{
          "--editor-font": "sans-serif",
          "--editor-font-heading": "sans-serif",
          "& .ProseMirror": {
            "& p": {
              color: "#f2f2f2",
              fontSize: "1rem",
              "& code": {
                backgroundColor: "#2e1065",
                borderColor: "#2e1065",
                color: "#f2f2f2",
                padding: "0.2rem 0.4rem",
              },
            },
            "& h1,h2,h3,h4,h5,h6": {
              color: "white",
            },
            "& h1": {
              fontSize: "1.9rem",
            },
            "& h2": {
              fontSize: "1.5rem",
            },
            "& h3": {
              fontSize: "1.3rem",
            },

            "& blockquote": {
              backgroundColor: "#020817",
              borderColor: "#404040",
            },
          },
        }}
      >
        <!-- <div class="container"> -->
        <!-- <div class="wrapper"> -->
        {#if !$navigating}
          <SvelteEditor
            content={doc.content}
            placeholder="Type '/' for options"
            onCreated={(createdEditor) => {
              editor = createdEditor;
            }}
            onChange="{(nextEditor) => {
              editor = nextEditor;
            }},"
            plugins={{
              selectImage: {
                handleUpload,
                // unsplash: {
                //   accessKey: "UNPLASH_API_KEY",
                // },
              },
              // gpt: { query: submitPromt },
            }}
          />
        {/if}
        <!-- </div> -->
        <!-- </div> -->
      </EditorTheme>
    </div>
    <!-- </div> -->
    <!-- <Textarea
    placeholder="Title"
    class="flex-1 resize-none overflow-y-auto"
    bind:value={doc.content}
    maxlength={4000}
  /> -->
    <!-- <p class="text-right text-gray-500">{inputLength}/4000 characters</p> -->
  </section>
</div>
{#if flashCardSidebar}
  <div
    class="flex-col md:col-span-2 p-5 overflow-y-scroll"
    id="flash-side-bar"
    transition:blur={{ duration: 300 }}
  >
    <div
      class="col-span-1 rounded drop-shadow-lg border border-card flex flex-col gap-3"
    >
      {#if !doc.flashCards || !doc.flashCards.cards || doc.flashCards.cards.length === 0}
        {#if flashCardsStatus === "loading"}
          <Button variant="outline" disabled
            ><Loader2 class="w-5 h-5 animate-spin" /></Button
          >
        {:else if flashCardsStatus === "error"}
          <p class="text-red-500">Error</p>
        {:else if flashCardsStatus === "idle"}
          <Button variant="default" on:click={createFlashCards}
            >Create Flash Cards</Button
          >
        {/if}
      {:else}
        <div>
          <Button variant="secondary" href={"/dashboard/flash-cards/" + doc.id}
            >View All Flash Cards</Button
          >
        </div>
        <div class="flex flex-col gap-2">
          {#if !doc.flashCards.cards || doc.flashCards.cards.length === 0}
            <p class="text-center">No Flash Cards</p>
          {:else if doc.flashCards.cards.length > 0}
            {#each doc.flashCards.cards as flashCard}
              <Card.Root class="border-secondary">
                <Card.Header>
                  {flashCard.question}
                </Card.Header>
                <Card.Footer>
                  {#if flashCard.answers}
                    {flashCard.answers.find((data) => {
                      return data.correctAnswer === true;
                    }).answer}
                  {/if}
                </Card.Footer>
              </Card.Root>
            {/each}
          {/if}
        </div>
      {/if}
    </div>
  </div>
{/if}
