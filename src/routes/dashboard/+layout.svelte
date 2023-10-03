<script lang="ts">
  import { Button } from "$lib/components/ui/button";

  export let data: any;
  $: ({ session } = data);

  const signOut = async () => {
    try {
      const response = await fetch("http://localhost:3000/auth/sign-out", {
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
  class="h-16 w-full border-secondary border-b flex flex-row items-center justify-between px-5"
>
  <div><a href="/" class="font-bold text-lg">Qwizify</a></div>
  <div>
    <ul class="flex flex-row items-center">
      <li>
        <Button variant="link" class="text-foreground" href="/dashboard"
          >Dashboard</Button
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
</div>

<slot />
