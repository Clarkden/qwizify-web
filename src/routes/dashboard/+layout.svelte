<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { PUBLIC_SERVER_URL } from "$env/static/public";
  import { Menu, MoreHorizontal, Plus, User } from "lucide-svelte";
  import { fade, slide } from "svelte/transition";
  import { navigating } from "$app/stores";
  import { onMount } from "svelte";
  import { Settings, FileText } from "lucide-svelte";
  import { deletedDocument, documentTitleUpdate } from "$lib/stores/documents";

  export let data: any;
  $: ({ session, path, user } = data);

  let docs: any = [];
  let loading: "idle" | "error" | "loading" = "loading";

  let mobileMenu = false;

  $: if ($navigating) {
    mobileMenu = false;
  }

  const signOut = async () => {
    try {
      const response = await fetch(`${PUBLIC_SERVER_URL}/auth/sign-out`, {
        method: "GET",
        credentials: "same-origin",
        headers: {
          Authorization: `Bearer ${session}`,
        },
      });
      window.location.reload();
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const createDoc = async () => {
    try {
      const response = await fetch(`${PUBLIC_SERVER_URL}/document/new`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session}`,
          "Access-Control-Allow-Origin": "*",
        },
      });

      window.location.replace("/dashboard/" + (await response.json()).id);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const getdocs = async () => {
    try {
      const response = await fetch(`${PUBLIC_SERVER_URL}/document`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session}`,
        },
      });

      docs = await response.json();

      loading = "idle";
    } catch (error) {
      loading = "error";
      console.log(error);
    }
  };

  onMount(getdocs);

  $: if ($deletedDocument) {
    getdocs();
    deletedDocument.set(false);
  }

  $: if ($documentTitleUpdate) {
    docs = docs.map((doc: any) => {
      if (doc.id === $documentTitleUpdate.id) {
        doc.title = $documentTitleUpdate.title;
      }

      return doc;
    });
  }
</script>

<!-- {#if !path.includes("admin")}
  <div
    class="h-16 w-full border-secondary border-b flex flex-row items-center justify-between px-5 relative"
  >
    <div
      class="flex flex-row items-center justify-between mx-auto w-full"
    >
      <div>
        <a href="/" class="font-bold text-2xl"
          >Qwizify
          <span class="text-sm text-green-400 font-normal"> Beta </span>
        </a>
      </div>
      <div class="hidden md:flex">
        <ul class="flex flex-row items-center">
          <li>
            <Button variant="link" class="text-foreground" href="/dashboard"
              >Dashboard</Button
            >
          </li>
          <li>
            <Button
              variant="link"
              class="text-foreground"
              href="/dashboard/account">Account</Button
            >
          </li>
          {#if user.role === "admin"}
            <li>
              <Button
                variant="link"
                class="text-foreground"
                href="/dashboard/admin">Admin</Button
              >
            </li>
          {/if}
          <li>
            <Button variant="ghost" on:click={signOut}>Logout</Button>
          </li>
        </ul>
      </div>
      <button
        class="md:hidden"
        on:click={() => {
          mobileMenu = !mobileMenu;
        }}
      >
        <Menu />
      </button>
      {#if mobileMenu}
        <div
          class="absolute md:hidden w-full top-full left-0 right-0 bg-neutral-200 p-3 z-50"
          in:slide
        >
          <ul class="flex flex-col items-center">
            <li>
              <Button
                variant="link"
                class="text-foreground w-full"
                href="/dashboard">Dashboard</Button
              >
            </li>
            <li>
              <Button
                variant="link"
                class="text-foreground text-left w-full"
                href="/dashboard/account">Account</Button
              >
            </li>
            {#if user.role === "admin"}
              <li>
                <Button
                  variant="link"
                  class="text-foreground text-left w-full"
                  href="/dashboard/admin">Admin</Button
                >
              </li>
            {/if}
            <li>
              <Button variant="link" on:click={signOut}>Logout</Button>
            </li>
          </ul>
        </div>
      {/if}
    </div>
  </div>
{/if} -->

<div
  class="h-screen grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3"
>
  <aside
    class="h-full col-span-1 px-5 flex flex-col gap-5 overflow-y-auto overflow-x-hidden border-r border-accent"
  >
    <div class="w-full pt-4">
      <a href="/" class="font-bold text-2xl"
        >Qwizify
        <span class="text-sm font-normal text-primary"> Beta </span>
      </a>
    </div>
    <ul class="flex flex-col">
      <li class="hover:bg-secondary p-1 rounded">
        <a
          href="/dashboard/account"
          class="text-foreground flex flex-row items-center"
        >
          <Settings class="w-5 h-5 mr-2" />
          Account</a
        >
      </li>
      <li class="hover:bg-secondary p-1 rounded">
        <button on:click={createDoc} class="flex flex-row items-center w-full">
          <Plus class="w-5 h-5 mr-2" />
          New Page
        </button>
      </li>
    </ul>
    <div class="flex flex-col gap-3 flex-1 overflow-y-auto">
      <ul class="flex flex-col flex-1">
        {#each docs as doc}
          <li
            class="p-1 rounded flex flex-row hover:bg-secondary overflow-x-hidden truncate"
          >
            <FileText class="w-5 h-5 min-w-[20px] mr-2" />
            <a class="w-full" href={`/dashboard/${doc.id}`}>
              {doc.title || "Untitled"}
            </a>
          </li>
        {/each}
      </ul>
    </div>
    <!-- <div class=" flex flex-row items-center"> -->
    <!-- <Button variant="ghost">
      {user.email}

    </Button> -->
    <!-- </div> -->
  </aside>
  <slot />
</div>
