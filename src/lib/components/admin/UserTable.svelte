<script lang="ts">
  import UserRow from "$lib/components/admin/UserRow.svelte";

  import * as Table from "$lib/components/ui/table";

  export let users: any;
</script>

<div class="flex flex-col w-full gap-3">
  <h1 class="text-xl font-bold">Users</h1>
  {#if users && users.length > 0}
    <div class="flex flex-col gap-3 w-full">
      {#each users as user}
        <UserRow {user} />
      {/each}
    </div>
  {/if}
</div>
