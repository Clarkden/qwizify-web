<script lang="ts">
  import UserRow from "$lib/components/admin/UserRow.svelte";
  import * as Table from "$lib/components/ui/table";
  import { Input } from "$lib/components/ui/input";
  import Button from "../ui/button/button.svelte";

  export let users: any;
</script>

<div class="flex flex-col w-full gap-3">
  <div class="flex flex-row gap-2 items-center">
    <h1 class="text-xl font-bold">Users</h1>
  </div>
  <div class="flex flex-row gap-2 items-center">
    <Button variant="secondary">Search</Button>
    <Input placeholder="Search" />
  </div>
  {#if users && users.length > 0}
    <div
      class="flex flex-col gap-3 w-full divide-y divide-secondary border p-2 rounded border-secondary"
    >
      {#each users as user}
        <UserRow {user} />
      {/each}
    </div>
  {/if}
</div>
