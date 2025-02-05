<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Card from "$lib/components/ui/card";
  import { DateTime } from "luxon";
  import { loadStripe } from "@stripe/stripe-js";
  import { PUBLIC_STRIPE_KEY } from "$env/static/public";
  import { onMount } from "svelte";
  import { CheckCircle2, Loader2, X } from "lucide-svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { PUBLIC_SERVER_URL } from "$env/static/public";
  import Input from "$lib/components/ui/input/input.svelte";
  import { Switch } from "$lib/components/ui/switch";
  import toast from "svelte-french-toast";

  export let data: any;
  $: ({ user, session } = data);
  $: planExpiresIn = DateTime.fromMillis(user.planExpires)
    .toLocal()
    .diffNow(["days", "hours"]);
  $: status = $page.url.searchParams.get("success");

  let stripe: any = null;
  let processing = false;
  let error: any;
  let purchasingPlan: "monthly" | "yearly" = "monthly";

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

    if (status) {
      if (status === "true") {
        setTimeout(() => {
          goto("/dashboard/account");
        }, 500);
        toast.success("Payment successful!");
      } else {
        toast.error("Payment unsuccessful. Please try again.");
        setTimeout(() => {
          goto("/dashboard/account");
        }, 500);
      }
    }
  });
</script>

<svelte:head>
  <title>Account</title>
</svelte:head>

<section class="w-full flex flex-col gap-4 col-span-4">
  <!-- {#if status === "true"}
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
  {/if} -->
  <div class="p-5 flex flex-col gap-5">
    <h2 class="font-bold text-lg">Account</h2>
    <div>
      <!-- <p class="">
        {user.email}
      </p> -->
      <p class="font-medium">
        Your Plan:
        <span class="font-light">
          {user.plan === "free" ? "Free" : "Premium"}
        </span>
      </p>
    </div>
    <div class="flex flex-row items-center justify-between">
      <div class="flex flex-col gap-4 w-full">
        {#if user.plan === "free"}
          <div class="flex flex-col">
            <p>
              <span class="text-sm text-neutral-400">
                <!-- {#if planExpiresIn.days > 0}
                  Expires
                  {DateTime.fromMillis(user.planExpires).toRelative()}
                {:else}
                  Your trial has ended
                {/if} -->
              </span>
            </p>
          </div>
          <div class="flex flex-col md:flex-row gap-5 w-full">
            <Card.Root class="border-secondary flex-1 max-w-[500px]">
              <Card.Header>
                <Card.Title>
                  <div
                    class="flex flex-row w-full items-center justify-between"
                  >
                    {#if purchasingPlan === "monthly"}
                      <p>Monthly</p>
                    {:else if purchasingPlan === "yearly"}
                      <p class="flex flex-row items-center gap-2">Yearly</p>
                    {/if}
                    <div class="flex flex-row gap-2 items-center">
                      <p class="text-sm">Monthly</p>
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
                            ? "bg-blue-300 justify-end"
                            : "bg-neutral-600 justify-start"
                        } flex flex-row  rounded-full items-center`}
                      >
                        <div class="w-6 h-6 bg-primary rounded-full" />
                      </button>
                      <p class="text-sm">Yearly</p>
                    </div>
                  </div>
                </Card.Title>
              </Card.Header>
              <Card.Content>
                <p class="text-neutral-600 mb-6">
                  Get everything Qwizify has to offer
                </p>
                <p>
                  <span class="text-2xl font-bold">
                    {#if purchasingPlan === "monthly"}
                      $2.99
                    {:else if purchasingPlan === "yearly"}
                      $29.99
                    {/if}
                  </span>
                  <span class="text-sm text-neutral-500">
                    {#if purchasingPlan === "monthly"}
                      per month
                    {:else if purchasingPlan === "yearly"}
                      per year
                    {/if}
                  </span>
                </p>
                <div
                  class="text-sm text-neutral-500 divide-y mt-5 divide-neutral-500"
                >
                  <p class="py-3 flex flex-row items-center gap-2">
                    <CheckCircle2 class="w-5 h-5 text-green-400" />
                    Unlimited Documents
                  </p>
                  <p class="py-3 flex flex-row items-center gap-2">
                    <CheckCircle2 class="w-5 h-5 text-green-400" />
                    Flash Cards
                  </p>
                  <p class="py-3 flex flex-row items-center gap-2">
                    <CheckCircle2 class="w-5 h-5 text-green-400" />
                    AI Powered Flash Cards
                  </p>
                  <p class="py-3 flex flex-row items-center gap-2">
                    <CheckCircle2 class="w-5 h-5 text-green-400" />
                    AI Practice Tests
                  </p>
                  <p class="py-3 flex flex-row items-center gap-2">
                    <CheckCircle2 class="w-5 h-5 text-green-400" />
                    AI Tutor
                  </p>
                </div>
                <div>
                  <Button
                    variant="default"
                    on:click={() => {
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
                <p class="text-neutral-600 text-sm underline">Renews</p>
                <p class="text-neutral-600 text-sm">
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
  </div>
</section>
