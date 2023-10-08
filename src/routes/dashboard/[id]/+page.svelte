<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import { ArrowLeft, Loader2 } from "lucide-svelte";
  import { onDestroy } from "svelte";
  import {PUBLIC_SERVER_URL} from "$env/static/public";

  export let data: any;
  $: ({ doc, session } = data);
  $: inputLength = doc.content.length;

  let loading: "idle" | "error" | "loading" = "idle";

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
          content: doc.content,
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const createFlashCards = async () => {
    loading = "loading";
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
            documentId: doc.id,
          }),
        }
      );

      loading = "idle";

      window.location.href = "/dashboard/flash-cards/" + doc.id;
    } catch (error) {
      console.log(error);
      loading = "error";
    }
  };

  onDestroy(async () => await saveDoc());
</script>

<section class="p-5 sm:mx-auto sm:w-2/3 md:w-3/5">
  <Button
    variant="ghost"
    on:click={() => history.back()}
    class="flex flex-row gap-2 items-center"
    ><ArrowLeft class="w-5 h-5" /> Back</Button
  >
</section>
<section
  class="section p-5 flex flex-col gap-5 flex-1 mx-auto sm:w-2/3 md:w-3/5"
>
  <div class="flex justify-between items-center">
    <Input placeholder="Title" class="w-fit" bind:value={doc.title} />
    <div class="flex flex-row items-center gap-3">
      {#if doc.flashCards}
        <Button variant="secondary" href={"/dashboard/flash-cards/" + doc.id}
          >View Flash Cards</Button
        >
        <Button
          variant="default"
          href={"/dashboard/flash-cards/" + doc.id + "/practice"}
          >Practice Test</Button
        >
      {:else if loading === "loading"}
        <Button variant="outline">
          <Loader2 class="w-5 h-5 animate-spin" />
        </Button>
      {:else if loading === "error"}
        <Button variant="destructive" disabled>
          <p class="text-red-500">Error</p>
        </Button>
      {:else if loading === "idle"}
        <Button variant="ghost" on:click={saveDoc}>Save</Button>
        <Button variant="default" on:click={createFlashCards}
          >Create Flash Cards</Button
        >
      {/if}
    </div>
  </div>
  <Textarea
    placeholder="Title"
    class="flex-1 resize-none overflow-y-auto"
    bind:value={doc.content}
    maxlength={4000}
  />
  <p class="text-right text-gray-500">{inputLength}/4000 characters</p>
</section>
