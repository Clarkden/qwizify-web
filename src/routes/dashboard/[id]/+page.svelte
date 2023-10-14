<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import { ArrowLeft, Loader2, MoreHorizontal } from "lucide-svelte";
  import { onDestroy } from "svelte";
  import { PUBLIC_SERVER_URL } from "$env/static/public";
  import { goto } from "$app/navigation";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { EditorTheme, SvelteEditor } from "@nextlint/svelte";
  import type { Editor } from "@tiptap/core";
  import { navigating } from "$app/stores";
  import { deletedDocument, documentTitleUpdate } from "$lib/stores/documents";

  export let data: any;
  $: ({ doc, session, user } = data);
  $: inputLength = doc.content.length;
  let input = "";

  let loading: "idle" | "error" | "loading" = "idle";
  let editor: Editor;

  const onSave = () => {
    const json = editor.getJSON();
    localStorage.setItem("editor", JSON.stringify(json));
  };

  const submitPromt = async (prompt: string) => {
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
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const createFlashCards = async () => {
    loading = "loading";

    try {
      await saveDoc();
      window.location.href = "/dashboard/flash-cards/" + doc.id;
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

  onDestroy(() => {
    saveDoc();
    console.log("doc saved");
  });
</script>

<!-- bg-[#fffdd0] -->
<!-- <div
  class="h-screen grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3 p-3 bg-slate-50"
> -->
<!-- {doc.content} -->

<div
  class="col-span-1 sm:col-span-3 md:col-span-4 overflow-y-auto overflow-x-hidden"
>
  <!-- <section class="p-5 w-full">
      <Button
        variant="ghost"
        on:click={() => {
          saveDoc();
          goto("/dashboard");
        }}
        class="flex flex-row gap-2 items-center"
        ><ArrowLeft class="w-5 h-5" /> Back</Button
      >
    </section> -->
  <section class="section p-5 px-10 w-full flex flex-col gap-5 flex-1">
    <div
      class="flex flex-col md:flex-row gap-4 md:justify-between md:items-center"
    >
      <input
        placeholder="Title"
        class="outline-none border-accent border-b-2 py-2 text-2xl font-bold w-fit bg-transparent"
        bind:value={doc.title}
        on:input={() => {
          console.log($documentTitleUpdate);
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
      </div>
    </div>
    <!-- <div class="editor"> -->
    <EditorTheme
      override={{
        "--editor-font": "sans-serif",
        "--editor-font-heading": "sans-serif",
      }}
    >
      <!-- <div class="container"> -->
      <!-- <div class="wrapper"> -->
      {#if !$navigating}
        <SvelteEditor
          content={doc.content}
          placeholder="Press 'space' GPT support, type '/' for help"
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
            gpt: { query: submitPromt },
          }}
        />
      {/if}
      <!-- </div> -->
      <!-- </div> -->
    </EditorTheme>
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
<!-- <div class="col-span-1 bg-white p-5 rounded drop-shadow-lg border">
  <h1 class="font-bold text-lg">Actions</h1>
</div> -->
<!-- </div> -->
