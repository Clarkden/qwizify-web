<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import {
    ArrowLeft,
    Diamond,
    FileText,
    Loader2,
    Menu,
    MoreHorizontal,
    Share,
    Trash,
    X,
  } from "lucide-svelte";
  import { onDestroy, onMount } from "svelte";
  import { PUBLIC_CLIENT_URL, PUBLIC_SERVER_URL } from "$env/static/public";
  import { goto } from "$app/navigation";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { EditorTheme, SvelteEditor } from "@nextlint/svelte";
  import type { Editor } from "@tiptap/core";
  import { navigating } from "$app/stores";
  import { deletedDocument, documentTitleUpdate } from "$lib/stores/documents";
  import { browser } from "$app/environment";
  import DialogMenu from "$lib/components/Dialog.svelte";
  import Switch from "$lib/components/Switch.svelte";
  import toast from "svelte-french-toast";
  // import { Switch } from "$lib/components/ui/switch";
  // import { Label } from "$lib/components/ui/label";

  export let data: any;
  $: ({ doc, session, user } = data);
  $: ({ flashCards } = doc);
  $: shareState = Boolean(doc.publicView);
  // $: result = "";
  let dialogMenuToggle = false;
  let typingInterval = 5000;
  let typingTimer: any = null;
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

  const handleUpload = async (file: File): Promise<string> => {
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
          publicView: doc.publicView,
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  // const isJson = (item: string) => {
  //   let value = typeof item !== "string" ? JSON.stringify(item) : item;
  //   try {
  //     value = JSON.parse(value);
  //   } catch (e) {
  //     return false;
  //   }

  //   return typeof value === "object" && value !== null;
  // };

  // const createFlashCards = async () => {
  //   // loading = "loading";

  //   try {
  //     await saveDoc();
  //     // window.location.href = "/dashboard/flash-cards/" + doc.id;

  //     flashCardsStatus = "loading";
  //     const response = await fetch(
  //       `${PUBLIC_SERVER_URL}/document/flash-cards`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${session}`,
  //         },
  //         body: JSON.stringify({
  //           documentId: doc.id,
  //         }),
  //       }
  //     );

  //     const reader = response?.body?.getReader();
  //     const decoder = new TextDecoder("utf-8");

  //     let object = "";

  //     while (true) {
  //       const { done, value } = await reader!.read();
  //       // console.log(done, value)
  //       const decodedChunk = decoder.decode(value);

  //       object += decodedChunk;
  //       // result += decodedChunk;

  //       if (done) {
  //         console.log("done streaming");
  //         flashCardsStatus = "idle";

  //         console.log("checking if json");

  //         if (!isJson(object)) {
  //           console.log("not json");

  //           flashCardsStatus = "error";
  //           break;
  //         }

  //         console.log("json");

  //         let cards = JSON.parse(object);

  //         if (Array.isArray(cards)) {
  //           flashCards.cards = cards;
  //         } else {
  //           flashCards.cards = [cards];
  //         }

  //         break;
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     loading = "error";
  //   }
  // };

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

  const updateShareState = async () => {
    try {
      doc.publicView = shareState;
      await saveDoc();
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
  });
</script>

<svelte:head>
  <title>{doc.title}</title>
</svelte:head>

{#if dialogMenuToggle}
  <div>
    <DialogMenu>
      <div class="flex flex-row gap-3 justify-between items-start">
        <h3 class="font-medium text-lg mb-3">Share</h3>
        <button
          on:click={() => {
            dialogMenuToggle = false;
          }}
        >
          <X class="w-5 h-5" />
        </button>
      </div>
      <div class="flex items-center space-x-2 mb-4">
        <div class="flex flex-row gap-2 items-center">
          <Switch
            state={shareState}
            on:switch={() => {
              shareState = !shareState;
            }}
          />
          <p>Public?</p>
        </div>
      </div>
      {#if shareState}
        <div class="flex flex-col gap-2">
          <p class="text-sm text-neutral-400">
            Anyone with the link can view this document
          </p>
          <div class="flex flex-row gap-2">
            <Input
              class="w-full"
              value={`${PUBLIC_CLIENT_URL}/document/${doc.id}`}
              readonly
            />
            <Button
              variant="outline"
              on:click={() => {
                navigator.clipboard.writeText(
                  `${PUBLIC_CLIENT_URL}/document/${doc.id}`
                );
                toast.success("Copied to clipboard");
              }}
            >
              Copy
            </Button>
          </div>
        </div>
      {/if}
      {#if !shareState}
        <div class="flex flex-col gap-2">
          <p class="text-sm text-neutral-400">
            Only you can view this document
          </p>
        </div>
      {/if}
      <Button
        class="mt-4"
        on:click={() => {
          updateShareState();
          dialogMenuToggle = false;
        }}>Save</Button
      >
    </DialogMenu>
  </div>
{/if}

<div
  class={`flex-1 flex flex-row gap-3 min-h-screen h-fit bg-white ${
    dialogMenuToggle ? "pointer-events-none" : "pointer-events-auto"
  }`}
>
  <div
    id="editor"
    class={`max-w-[800px] w-full mx-auto h-fit ${
      flashCardSidebar ? "md:w-[calc(100%-340px)]" : "md:w-full"
    }`}
  >
    <section
      class="section p-5 mt-10 md:px-10 w-full flex flex-col gap-5 flex-1"
    >
      <div class="flex flex-row gap-4 justify-between items-center">
        <!-- <FileText class="w-5 h-5 min-w-[20px] mr-2" /> -->
        <input
          placeholder="Title"
          class="outline-none py-2 text-2xl font-bold w-full bg-transparent"
          bind:value={doc.title}
          on:input={() => {
            documentTitleUpdate.set({ id: doc.id, title: doc.title });
          }}
        />
        <div class="hidden md:flex flex-row items-center gap-3 w-fit">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild let:builder>
              <Button
                builders={[builder]}
                variant="ghost"
                class="!m-0 !p-0 !h-0"
              >
                <MoreHorizontal />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content class="w-56 border-secondary">
              <DropdownMenu.Group>
                <DropdownMenu.Label>Options</DropdownMenu.Label>
                <DropdownMenu.Separator />
              </DropdownMenu.Group>
              <DropdownMenu.Group>
                {#if user.plan !== "free" || user.role === "admin"}
                  <DropdownMenu.Item
                    on:click={() => {
                      goto("/dashboard/flash-cards/" + doc.id);
                    }}
                    class="flex flex-row items-center gap-2"
                  >
                    <Diamond class="w-4 h-4" />
                    Flash Cards</DropdownMenu.Item
                  >
                  <DropdownMenu.Separator />
                {/if}

                <DropdownMenu.Item
                  on:click={() => {
                    dialogMenuToggle = true;

                    // shareButton.click();
                  }}
                  class="flex flex-row items-center gap-2"
                >
                  <Share class="w-4 h-4" />
                  Share</DropdownMenu.Item
                >

                <DropdownMenu.Separator />

                <DropdownMenu.Item
                  on:click={deleteDoc}
                  class="flex flex-row items-center gap-2"
                >
                  <Trash class="w-4 h-4" />
                  Delete</DropdownMenu.Item
                >
              </DropdownMenu.Group>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
          <!-- <Button
            variant="ghost"
            class="hidden md:block"
            on:click={() => {
              flashCardSidebar = !flashCardSidebar;
            }}
          >
            {#if flashCardSidebar}
              <X />
            {:else}
              <Menu />
            {/if}
          </Button> -->
        </div>
        <div class="absolute top-5 right-5 block md:hidden">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild let:builder>
              <Button
                builders={[builder]}
                variant="ghost"
                class="!m-0 !p-0 !h-0"
              >
                <MoreHorizontal />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content class="w-56 border-secondary">
              <DropdownMenu.Group>
                <DropdownMenu.Label>Options</DropdownMenu.Label>
                <DropdownMenu.Separator />
              </DropdownMenu.Group>
              <DropdownMenu.Group>
                {#if user.plan !== "free" || user.role === "admin"}
                  <DropdownMenu.Item
                    on:click={() => {
                      goto("/dashboard/flash-cards/" + doc.id);
                    }}
                    class="flex flex-row items-center gap-2"
                  >
                    <Diamond class="w-4 h-4" />
                    Flash Cards</DropdownMenu.Item
                  >
                  <DropdownMenu.Separator />
                {/if}
                <DropdownMenu.Item
                  on:click={() => {
                    dialogMenuToggle = true;

                    // shareButton.click();
                  }}
                  class="flex flex-row items-center gap-2"
                >
                  <Share class="w-4 h-4" />
                  Share</DropdownMenu.Item
                >
                <DropdownMenu.Separator />
                <DropdownMenu.Item
                  on:click={deleteDoc}
                  class="flex flex-row items-center gap-2"
                >
                  <Trash class="w-4 h-4" />
                  Delete</DropdownMenu.Item
                >
              </DropdownMenu.Group>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </div>
      <div
        class="!text-black !drop-shadow-none !Shadow-none !h-fit"
        role="textbox"
        aria-multiline="true"
        tabindex="0"
        on:keyup={() => {
          clearTimeout(typingTimer);
          typingTimer = setTimeout(() => {
            saveDoc();
          }, typingInterval);
        }}
        on:keydown={() => {
          clearTimeout(typingTimer);
        }}
      >
        <EditorTheme
          override={{
            "--editor-font": "sans-serif",
            "--editor-font-heading": "sans-serif",
            "& .ProseMirror": {
              "& p": {
                // color: "#f2f2f2",
                fontSize: "1rem",
              },
              "& h1,h2,h3,h4,h5,h6": {
                color: "black",
              },
              "& h1": {
                fontSize: "1.5rem",
              },
              "& h2": {
                fontSize: "1.3rem",
              },
              "& h3": {
                fontSize: "1.2rem",
              },
              "& h4": {
                fontSize: "1rem",
              },
              "& blockquote": {
                "border-left": "4px solid #f2f2f2",
                "padding-left": "10px",
                "margin-left": "0",
                "margin-top": "10px",
                "margin-bottom": "10px",
              },
            },
          }}
        >
          {#if !$navigating}
            <SvelteEditor
              content={doc.content}
              placeholder="Type '/' for options"
              onCreated={(createdEditor) => {
                editor = createdEditor;
              }}
              onChange={(nextEditor) => {
                editor = nextEditor;
              }}
              plugins={{
                selectImage: {
                  handleUpload,
                  // unsplash: {
                  //   accessKey: "UNPLASH_API_KEY",
                  // },
                },
                gpt: { query: submitPromt },
              }}
            />
          {/if}
        </EditorTheme>
      </div>
    </section>
  </div>

  <!-- {#if flashCardSidebar}
          <div
            class="w-[340px] p-5 hidden md:block"
            id="flash-side-bar"
              }}
              onChange={(nextEditor: Editor) => {
                editor = nextEditor;
              }}
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
        </EditorTheme>
      </div>
    </section>
  </div>

  <!-- {#if flashCardSidebar}
    <div
      class="w-[340px] p-5 hidden md:block"
      id="flash-side-bar"
      transition:blur={{ duration: 300 }}
    >
      <div class="col-span-1 rounded flex flex-col gap-3">
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
            <Button
              variant="secondary"
              href={"/dashboard/flash-cards/" + doc.id}
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
  {/if} -->
</div>
