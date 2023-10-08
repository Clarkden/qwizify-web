<script lang="ts">
  import { PUBLIC_SERVER_URL } from "$env/static/public";
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
  import { Loader2 } from "lucide-svelte";

  let error: string;
  let loading: "idle" | "error" | "loading" = "idle";

  const googleSignIn = async () => {
    loading = "loading";
    try {
      const response = await fetch(`${PUBLIC_SERVER_URL}/oauth/google`, {
        method: "GET",
        credentials: "include",
      });

      console.log(response);

      const data = await response.json();

      window.location.href = data.url;
    } catch (error: any) {
      console.log(error.message);
      loading = "error";
    }
  };

  const appleSignIn = async () => {
    loading = "loading";
    try {
      const response = await fetch(`${PUBLIC_SERVER_URL}/oauth/apple`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      window.location.href = data.url;
    } catch (error: any) {
      console.log(error.message);
      loading = "error";
    }
  };
</script>

<section class="flex flex-row items-center justify-center flex-1">
  <Card.Root class="w-11/12 md:w-[500px] md:min-w-[500px] h-fit border-accent">
    <Card.Header>
      <Card.Title>Start Studying with Qwizify</Card.Title>
      <Card.Description
        >Sign in with one of the providers below</Card.Description
      >
    </Card.Header>
    <Card.Content>
      {#if loading === "error"}
        <p class="text-red-500">Something went wrong</p>
      {:else if loading === "idle"}
        <Button on:click={googleSignIn} class="w-full mb-4">Google</Button>
        <Button on:click={appleSignIn} class="w-full mb-4">Apple</Button>
      {:else if loading === "loading"}
        <Button variant="outline" class="w-full mb-4">
          <Loader2 class="animate-spin" />
        </Button>
      {/if}
    </Card.Content>
  </Card.Root>
</section>
