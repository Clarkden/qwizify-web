<script lang="ts">
  import { PUBLIC_SERVER_URL } from "$env/static/public";
  import { onMount } from "svelte";
  import UserTable from "$lib/components/admin/UserTable.svelte";

  export let data: any;
  $: ({ session } = data);

  let users: any[];

  onMount(async () => {
    try {
      const response = await fetch(`${PUBLIC_SERVER_URL}/admin/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session}`,
        },
      });

      const data = await response.json();
      console.log(data)
      users = data;
    } catch (error) {
      console.log(error);
    }
  });
</script>

<section
  class="p-5 sm:mx-auto sm:w-2/3 md:w-3/5 flex flex-row gap-3 items-center"
>
  <UserTable {users} />
</section>
