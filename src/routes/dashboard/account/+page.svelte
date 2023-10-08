<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Card from "$lib/components/ui/card";
  import { DateTime } from "luxon";
  import { loadStripe } from "@stripe/stripe-js";
  import { PUBLIC_STRIPE_KEY } from "$env/static/public";
  import { onMount } from "svelte";
  import { Loader2, X } from "lucide-svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { PUBLIC_SERVER_URL } from "$env/static/public";
  import Input from "$lib/components/ui/input/input.svelte";
  import { Switch } from "$lib/components/ui/switch";

  export let data: any;
  $: ({ user, session } = data);
  $: planExpiresIn = DateTime.fromMillis(user.planExpires)
    .toLocal()
    .diffNow(["days", "hours"]);
  $: status = $page.url.searchParams.get("success");

  let stripe: any = null;
  let processing = false;
  let error: any;
  let purchasingPlan: "monthly" | "yearly" = "yearly";
  let annual = false;

  const createPayment = async () => {
    if (!purchasingPlan) return;

    try {
      const response = await fetch(
        `${PUBLIC_SERVER_URL}/payments/create-subscription`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plan: purchasingPlan,
          }),
        }
      );

      const data = await response.json();

      window.location.href = data.url;

      //   const data = await response.json();
      //   clientSecret = data.clientSecret;
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const createPortalSession = async () => {
    try {
      const response = await fetch(`${PUBLIC_SERVER_URL}/customer/portal`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session}`,
        },
      });

      const data = await response.json();

      window.location.href = data.url;
    } catch (error: any) {
      console.log(error.message);
    }
  };

  onMount(async () => {
    stripe = await loadStripe(PUBLIC_STRIPE_KEY);
  });
</script>

<section class="p-5 mx-auto w-full sm:w-2/3 md:w-3/5 flex flex-col gap-4">
  <!-- {#if error}
    {JSON.stringify(error)}
  {/if} -->
  {#if status === "true"}
    <div
      class="flex flex-col items-center justify-center border border-green-500 rounded-lg p-5 bg-green-400/25 relative"
    >
      <button
        on:click={() => {
          goto("/dashboard/account");
        }}
      >
        <X class="text-green-500 absolute top-2 left-2" />
      </button>
      <h1 class="text-3xl font-bold">Success!</h1>
      <p class="text-lg text-center">
        Your payment was successful. You can now create unlimited documents.
      </p>
    </div>
  {:else if status === "false"}
    <div
      class="flex flex-col items-center justify-center border border-red-500 rounded-lg p-5 bg-red-400/25 relative"
    >
      <button
        on:click={() => {
          goto("/dashboard/account");
        }}
      >
        <X class="text-red-500 absolute top-2 left-2" />
      </button>
      <h1 class="text-3xl font-bold">Error</h1>
      <p class="text-lg text-center">
        Your payment was unsuccessful. Please try again.
      </p>
    </div>
  {/if}
  <Card.Root class="border-secondary">
    <Card.Header>
      <Card.Title>Subscription</Card.Title>
    </Card.Header>
    <Card.Content class="flex flex-col">
      <div class="flex flex-row items-center justify-between">
        <div class="flex flex-col gap-4 w-full">
          {#if user.plan === "free"}
            <div class="flex flex-col">
              <p>
                <span class="text-sm text-neutral-400">
                  {#if planExpiresIn.days > 0}
                    Expires
                    {DateTime.fromMillis(user.planExpires).toRelative()}
                  {:else}
                    Your trial has ended
                  {/if}
                </span>
              </p>
            </div>
            <div class="flex flex-col md:flex-row gap-5 w-full">
              <Card.Root class="border-green-400 flex-1">
                <Card.Header>
                  <Card.Title>
                    <div
                      class="flex flex-row w-full items-center justify-between"
                    >
                      {#if purchasingPlan === "monthly"}
                        <p>Monthly</p>
                      {:else if purchasingPlan === "yearly"}
                        <p class="flex flex-row items-center gap-2">
                          Yearly <span
                            class="bg-white p-1 text-xs rounded text-black"
                          >
                            Best Value
                          </span>
                        </p>
                      {/if}
                      <button
                        on:click={() => {
                          if (purchasingPlan === "monthly") {
                            purchasingPlan = "yearly";
                          } else {
                            purchasingPlan = "monthly";
                          }
                        }}
                        class={`w-12 h-6 ${
                          purchasingPlan === "yearly"
                            ? "bg-white justify-end"
                            : "bg-neutral-600 justify-start"
                        } flex flex-row  rounded-full items-center`}
                      >
                        <div class="w-6 h-6 bg-green-400 rounded-full" />
                      </button>
                    </div>
                  </Card.Title>
                </Card.Header>
                <Card.Content>
                  <div class="flex flex-col mb-4">
                    <p class="text-sm text-neutral-300">Unlimited Docs</p>
                    <p class="text-sm text-neutral-300">
                      Up to 16 cards per set
                    </p>
                    <p class="text-sm text-neutral-300">GPT-4</p>
                  </div>
                  <p class="text-2xl font-bold">
                    {#if purchasingPlan === "monthly"}
                      $2.99
                    {:else if purchasingPlan === "yearly"}
                      $29.99
                    {/if}
                  </p>
                  <p class="text-sm text-neutral-400">
                    {#if purchasingPlan === "monthly"}
                      per month
                    {:else if purchasingPlan === "yearly"}
                      per year
                    {/if}
                  </p>
                  <div>
                    <Button
                      variant="outline"
                      on:click={() => {
                        purchasingPlan = "monthly";
                        createPayment();
                      }}
                      class="mt-4"
                    >
                      {#if processing}
                        <Loader2 class="mr-2 animate-spin" />
                      {/if}
                      Buy
                    </Button>
                  </div>
                </Card.Content>
              </Card.Root>
            </div>
          {:else}
            <div class="border p-4 rounded-md border-secondary bg-background">
              {#if user.plan === "month"}
                Monthly Plan
              {:else if user.plan === "year"}
                Yearly Plan
              {/if}
              <div class="flex flex-row gap-3 justify-between items-center">
                <div class="flex flex-col mt-3">
                  <p class="text-neutral-400 text-sm underline">Renews</p>
                  <p class="text-neutral-400 text-sm">
                    {DateTime.fromMillis(user.planExpires).toLocaleString()}
                  </p>
                </div>
                <Button on:click={createPortalSession}>
                  Manage Subscription
                </Button>
              </div>
            </div>
          {/if}
        </div>
      </div>
    </Card.Content>
  </Card.Root>
</section>
