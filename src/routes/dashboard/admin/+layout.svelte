<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { navigating } from "$app/stores";
  import { PUBLIC_SERVER_URL } from "$env/static/public";
  import { slide } from "svelte/transition";
  import { Menu } from "lucide-svelte";

  export let data: any;
  $: ({ session } = data);

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
</script>

<div
  class="h-16 w-full border-secondary border-b flex flex-row items-center justify-between px-5 relative md:mt-0 mt-16"
>
  <div
    class="flex flex-row items-center justify-between mx-auto w-full sm:w-2/3 md:w-3/5"
  >
    <div>
      <a href="/dashboard" class="font-bold text-2xl"
        >Admin
        <span class="text-sm text-primary font-normal"> Beta </span>
      </a>
    </div>
    <div class="hidden md:flex">
      <ul class="flex flex-row items-center">
        <li>
          <Button variant="link" class="text-foreground" href="/dashboard/admin"
            >Dashboard</Button
          >
        </li>
        <li>
          <Button
            variant="link"
            class="text-foreground"
            href="/dashboard/admin/users">Users</Button
          >
        </li>
        <!-- <li>
        <Button variant="link" class="text-foreground" href="/dashboard/flash-cards"
          >Flash Cards</Button
        >
      </li> -->
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
              href="/dashboard/admin/users">Users</Button
            >
          </li>
          <!-- <li>
          <Button variant="link" class="text-foreground" href="/dashboard/flash-cards"
            >Flash Cards</Button
          >
        </li> -->
          <li>
            <Button variant="link" on:click={signOut}>Logout</Button>
          </li>
        </ul>
      </div>
    {/if}
  </div>
</div>

<slot />
