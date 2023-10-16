<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { PUBLIC_SERVER_URL } from "$env/static/public";
  import {
    Menu,
    MoreHorizontal,
    Plus,
    ChevronsLeft,
    ChevronsRight,
    LogOut,
    Bell,
  } from "lucide-svelte";
  import { fade, fly, slide } from "svelte/transition";
  import { navigating } from "$app/stores";
  import { onMount } from "svelte";
  import { Settings, FileText } from "lucide-svelte";
  import { deletedDocument, documentTitleUpdate } from "$lib/stores/documents";
  import { page } from "$app/stores";
  import { clickOutside } from "svelte-use-click-outside";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";

  export let data: any;
  $: ({ session, path, user } = data);

  let docs: any = [];
  let loading: "idle" | "error" | "loading" = "loading";

  let mobileMenu = false;
  let sideNav = true;

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

<div class="h-screen flex flex-row bg-white relative">
  {#if sideNav}
    <aside
      class="h-full col-span-1 px-5 hidden md:flex flex-col gap-5 overflow-y-auto overflow-x-hidden md:w-[240px] md:min-w-[240px] group relative"
      transition:fly={{ x: -100, duration: 500 }}
    >
      <button
        class="absolute top-5 right-5 hidden group-hover:block rounded-lg p-1 hover:bg-secondary transition"
        on:click={() => {
          sideNav = !sideNav;
        }}
      >
        <ChevronsLeft class="w-5 h-5" />
      </button>

      <div class="w-full pt-4 flex flex-row justify-start items-center gap-2">
        <!-- <a href="/" class="font-bold text-2xl"
          >Qwizify
          <span class="text-sm font-normal text-primary"> Beta </span>
        </a> -->
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild let:builder>
            <Button
              builders={[builder]}
              variant="ghost"
              class="rounded-full border !p-1 !h-8 !w-8 uppercase bg-slate-100"
            >
              {user.email[0]}
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content class="w-56 border-secondary">
            <!-- <DropdownMenu.Label>Options</DropdownMenu.Label>
        <DropdownMenu.Separator /> -->
            <DropdownMenu.Group>
              <DropdownMenu.Item
                on:click={signOut}
                class="flex flex-row items-center gap-1"
              >
                <LogOut class="w-4 h-4" />
                Log out</DropdownMenu.Item
              >
            </DropdownMenu.Group>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild let:builder>
            <Button
              builders={[builder]}
              variant="ghost"
              class="!p-1 !h-6 !w-6 uppercase "
            >
              <Bell />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content class="w-56 border-secondary">
            <!-- <DropdownMenu.Label>Options</DropdownMenu.Label>
        <DropdownMenu.Separator /> -->
            <DropdownMenu.Group>
              <DropdownMenu.Label>Notifcations</DropdownMenu.Label>
              <DropdownMenu.Separator />
              <DropdownMenu.Item>Nothing to see here yet.</DropdownMenu.Item>
              <!-- <DropdownMenu.Item
                on:click={signOut}
                class="flex flex-row items-center gap-1"
              >
                <LogOut class="w-4 h-4" />
                Log out</DropdownMenu.Item
              > -->
            </DropdownMenu.Group>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
      <Button variant="outline" on:click={createDoc}>
        <Plus class="w-5 h-5 mr-2" />
        New Page
      </Button>
      <ul class="flex flex-col">
        <!-- <li class="hover:bg-secondary p-1 rounded">
          <a
            href="/dashboard/account"
            class="text-foreground flex flex-row items-center text-sm"
          >
            <Settings class="w-5 h-5 mr-2" />
            Account</a
          >
        </li> -->
      </ul>
      <div class="flex flex-col gap-3 flex-1 overflow-y-auto">
        <ul class="flex flex-col flex-1">
          {#each docs as doc}
            <li
              class={`p-1 rounded flex flex-row hover:bg-secondary overflow-x-hidden truncate text-sm ${
                $page.params.id === doc.id ? "bg-secondary" : ""
              }`}
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
  {/if}
  {#if mobileMenu}
    <div class="absolute w-screen h-screen z-50 bg-black/5">
      <div
        class="w-4/5 h-screen bg-white m-2 z-50 drop-shadow-xl rounded-lg p-5 flex flex-col gap-3 relative"
        use:clickOutside={() => {
          setTimeout(() => {
            // if()
            mobileMenu = false;
          }, 50);
        }}
        transition:fade={{ duration: 300 }}
      >
        <button
          class="absolute top-5 right-5 rounded-lg p-1 hover:bg-secondary transition"
          on:click={() => {
            mobileMenu = false;
          }}
        >
          <ChevronsLeft class="w-5 h-5" />
        </button>
        <div class="w-full flex flex-row justify-start items-center gap-2">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild let:builder>
              <Button
                builders={[builder]}
                variant="ghost"
                class="rounded-full border !p-1 !h-8 !w-8 uppercase bg-slate-100"
              >
                {user.email[0]}
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content class="w-56 border-secondary">
              <!-- <DropdownMenu.Label>Options</DropdownMenu.Label>
          <DropdownMenu.Separator /> -->
              <DropdownMenu.Group>
                <DropdownMenu.Item
                  on:click={signOut}
                  class="flex flex-row items-center gap-1"
                >
                  <LogOut class="w-4 h-4" />
                  Log out</DropdownMenu.Item
                >
              </DropdownMenu.Group>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild let:builder>
              <Button
                builders={[builder]}
                variant="ghost"
                class="!p-1 !h-6 !w-6 uppercase "
              >
                <Bell />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content class="w-56 border-secondary">
              <!-- <DropdownMenu.Label>Options</DropdownMenu.Label>
          <DropdownMenu.Separator /> -->
              <DropdownMenu.Group>
                <DropdownMenu.Label>Notifcations</DropdownMenu.Label>
                <DropdownMenu.Separator />
                <DropdownMenu.Item>Nothing to see here yet.</DropdownMenu.Item>
                <!-- <DropdownMenu.Item
                  on:click={signOut}
                  class="flex flex-row items-center gap-1"
                >
                  <LogOut class="w-4 h-4" />
                  Log out</DropdownMenu.Item
                > -->
              </DropdownMenu.Group>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
        <Button variant="outline" on:click={createDoc}>
          <Plus class="w-5 h-5 mr-2" />
          New Page
        </Button>
        <ul class="flex flex-col">
          <!-- <li class="hover:bg-secondary p-1 rounded">
          <a
            href="/dashboard/account"
            class="text-foreground flex flex-row items-center text-sm"
          >
            <Settings class="w-5 h-5 mr-2" />
            Account</a
          >
        </li> -->
        </ul>
        <div class="flex flex-col gap-3 flex-1 overflow-y-auto">
          <ul class="flex flex-col flex-1">
            {#each docs as doc}
              <li
                class={`p-1 rounded flex flex-row hover:bg-secondary overflow-x-hidden truncate text-sm ${
                  $page.params.id === doc.id ? "bg-secondary" : ""
                }`}
              >
                <FileText class="w-5 h-5 min-w-[20px] mr-2" />
                <a class="w-full" href={`/dashboard/${doc.id}`}>
                  {doc.title || "Untitled"}
                </a>
              </li>
            {/each}
          </ul>
        </div>
      </div>
    </div>
  {/if}
  <div
    class="flex-1 bg-white drop-shadow overflow-y-auto m-2 ml-2 mr-2 mb-0 rounded-t-xl relative"
  >
    {#if !sideNav}
      <button
        class="absolute top-5 left-5 rounded-lg p-1 hover:bg-secondary transition"
        on:click={() => {
          sideNav = !sideNav;
        }}
      >
        <ChevronsRight class="w-5 h-5" />
      </button>
    {/if}

    <button
      class="absolute top-5 left-5 rounded-lg p-1 hover:bg-secondary transition block md:hidden"
      on:click={() => {
        mobileMenu = !mobileMenu;
      }}
    >
      <Menu class="w-5 h-5" />
    </button>

    <slot />
  </div>
</div>
