<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { Skeleton } from "$lib/components/ui/skeleton";
  import { onMount } from "svelte";
  import { Plus } from "lucide-svelte";
  import { DateTime } from "luxon";
  import { PUBLIC_SERVER_URL } from "$env/static/public";

  export let data: any;
  $: ({ session, user } = data);

  let loading: "idle" | "error" | "loading" = "loading";
  let docs: {
    id: string;
    title: string;
    userId: string;
    content: string;
    updatedAt: string;
    createdAt: string;
  }[] = [];

  const createDoc = async () => {
    try {
      const response = await fetch(`${PUBLIC_SERVER_URL}/document/new`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session}`,
          "Access-Control-Allow-Origin": "*",
        },
      });

      // window.location.replace("/dashboard/" + (await response.json()).id);

      window.location.href = "/dashboard/" + (await response.json()).id;
    } catch (error: any) {
      console.log(error.message);
    }
  };

  // const getdocs = async () => {
  //   try {
  //     const response = await fetch(`${PUBLIC_SERVER_URL}/document`, {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${session}`,
  //       },
  //     });

  //     docs = await response.json();

  //     loading = "idle";
  //   } catch (error) {
  //     loading = "error";
  //     console.log(error);
  //   }
  // };

  // onMount(getdocs);
</script>

<!-- <section
  class="p-5 sm:mx-auto sm:w-2/3 md:w-3/5 flex flex-row gap-3 items-center"
>
  {#if user.plan === "free" && user.role !== "admin"}
    {#if docs.length < 3}
      <Button on:click={createDoc}>
        <Plus class="mr-2" />
        Create Doc</Button
      >
    {:else}
      <Button href="/dashboard/account">Upgrade</Button>
       <p>
        You have reached the maximum number of docs for the free plan. Please
        upgrade to create more docs.
      </p> -->
<!-- {/if}
  {:else}
    <Button on:click={createDoc}>
      <Plus class="mr-2" />
      Create Doc</Button
    >
  {/if}
  {#if user.plan === "free" && user.role !== "admin"}
    <p class="text-sm text-neutral-400">
      {docs.length}/3 Free Docs
    </p>
  {/if} -->
<!-- </section> -->

<!-- <section class="p-5 mx-auto w-full sm:w-2/3 md:w-3/5"> -->
<!-- <div
  class="gap-5 col-span-1 sm:col-span-2 md:col-span-3 h-full w-full overflow-y-scroll"
>
  {#if loading === "idle"}
    {#if docs && docs.length > 0}
      {#each docs as doc (doc.id)}
        <a href={"/dashboard/" + doc.id} class="group">
          <Card.Root
            class="border-secondary group-hover:border-primary h-[200px] flex flex-col"
          >
            <Card.Header class="group">
              <Card.Title>{doc.title}</Card.Title>
            </Card.Header>
            <Card.Content class="flex-1">
              <p class="truncate">
                {@html doc.content}
              </p>
            </Card.Content>
            <Card.Footer>
              <p class="text-sm text-muted-foreground">
                Last Updated {DateTime.fromISO(doc.updatedAt).toLocaleString(
                  DateTime.DATETIME_MED
                )}
              </p>
            </Card.Footer>
          </Card.Root>
        </a>
      {/each}
    {/if}
  {:else if loading === "loading"}
    <Skeleton class="w-full h-[200px]" />
    <Skeleton class="w-full h-[200px]" />
    <Skeleton class="w-full h-[200px]" />
  {:else if loading === "error"}
    <Card.Root class="border-destructive">
      <Card.Header>
        <Card.Title>Something went wrong</Card.Title>
      </Card.Header>
      <Card.Content class="flex-1">Test</Card.Content>
      <Card.Content>
        <p>There was an error loading your docs</p>
      </Card.Content>
    </Card.Root>
  {/if}
</div> -->
<!-- </section> -->
<!-- <div
  class="w-full h-full border border-rounded bg-white p-5 rounded-lg col-span-1 sm:col-span-2 md:col-span-3"
>
  Create
</div> -->

<div
  class=" flex flex-col pt-5 gap-4  mt-12 p-5 flex-1"
>
  <!-- <div class="bg-white"> -->
  <h2 class="text-lg font-bold">Get Started</h2>
  <div class="bg-secondary p-3 rounded border border-accent w-fit">
    <h3 class="text-md font-bold">Create a New Page</h3>
    <p class="text-sm text-muted-primary">
      Pages are the main building blocks of Qwizify. Create a page to get
      started.
    </p>
  </div>
  <div class="flex flex-row gap-3 grid-flow-row w-fit">
    <Button on:click={createDoc}>
      <Plus class="w-5 h-5 mr-2" />
      Create Page
    </Button>
  </div>
  <!-- </div> -->
  <!-- <Button variant="default" on:click={createDoc}>
    <Plus class="mr-2" />
    Create Doc</Button
  > -->
</div>
