<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import { ArrowLeft, Loader2, MoreHorizontal } from "lucide-svelte";
  import { onDestroy } from "svelte";
  import { PUBLIC_SERVER_URL } from "$env/static/public";
  import { goto } from "$app/navigation";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";

  export let data: any;
  $: ({ doc, session, user } = data);
  $: inputLength = doc.content.length;
  let result = "";

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

      goto("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  onDestroy(async () => await saveDoc());
</script>

<section class="p-5 w-full sm:mx-auto sm:w-2/3 md:w-3/5">
  <Button
    variant="ghost"
    on:click={() => {
      saveDoc();
      goto("/dashboard");
    }}
    class="flex flex-row gap-2 items-center"
    ><ArrowLeft class="w-5 h-5" /> Back</Button
  >
</section>
<section
  class="section p-5 w-full flex flex-col gap-5 flex-1 mx-auto sm:w-2/3 md:w-3/5"
>
  <div
    class="flex flex-col md:flex-row gap-3 md:justify-between md:items-center"
  >
    <Input placeholder="Title" class="w-full md:w-fit" bind:value={doc.title} />
    <div class="flex flex-row items-center gap-3 w-full md:w-fit">
      {#if doc.flashCards}
        <Button
          variant="default"
          href={"/dashboard/flash-cards/" + doc.id}
          class="md:w-[auto] w-full">View Flash Cards</Button
        >
        <!-- <Button
          variant="default"
          href={"/dashboard/flash-cards/" + doc.id + "/practice"}
          class="md:w-[auto] w-full">Practice Test</Button
        > -->
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
        <Button
          variant="default"
          on:click={createFlashCards}
          class="md:w-[auto] w-full">Create Flash Cards</Button
        >
      {/if}
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
              <DropdownMenu.Item on:click={deleteDoc}>Delete</DropdownMenu.Item>
            </DropdownMenu.Group>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
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
