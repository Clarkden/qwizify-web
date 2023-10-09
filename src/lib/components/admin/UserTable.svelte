<script lang="ts">
  import UserRow from "./userRow.svelte";
  import { createTable, Render, Subscribe } from "svelte-headless-table";
  import { readable } from "svelte/store";
  import * as Table from "$lib/components/ui/table";

  export let users: any;

  const table = createTable(readable(users));

  const columns = table.createColumns([
    table.column({
      accessor: "id",
      header: "ID",
    }),
    // table.column({
    //   accessor: "status",
    //   header: "Status"
    // }),
    table.column({
      accessor: "email",
      header: "Email",
    }),
    table.column({
      accessor: "role",
      header: "Role",
    }),
    table.column({
      accessor: ({ email }) => email,
      header: "",
    }),
  ]);

  const { headerRows, pageRows, tableAttrs, tableBodyAttrs } =
    table.createViewModel(columns);
</script>

<div class="flex flex-col w-full gap-3">
  <h1 class="text-3xl font-bold">Users</h1>
  {#if users && users.length > 0}
    <div class="flex flex-col gap-3 w-full">
      {#each users as user}
        <UserRow {user} />
      {/each}
    </div>
  {/if}
</div>

<!-- <div class="rounded-md border">
  {#if users && users.length > 0}
    <Table.Root {...$tableAttrs}>
      <Table.Header>
        {#each $headerRows as headerRow}
          <Subscribe rowAttrs={headerRow.attrs()}>
            <Table.Row>
              {#each headerRow.cells as cell (cell.id)}
                <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
                  <Table.Head {...attrs}>
                    <Render of={cell.render()} />
                  </Table.Head>
                </Subscribe>
              {/each}
            </Table.Row>
          </Subscribe>
        {/each}
      </Table.Header>
      <Table.Body {...$tableBodyAttrs}>
        {#each $pageRows as row (row.id)}
          <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
            <Table.Row {...rowAttrs}>
              {#each row.cells as cell (cell.id)}
                <Subscribe attrs={cell.attrs()} let:attrs>
                  <Table.Cell {...attrs}>
                    <Render of={cell.render()} />
                  </Table.Cell>
                </Subscribe>
              {/each}
            </Table.Row>
          </Subscribe>
        {/each}
      </Table.Body>
    </Table.Root>
  {/if}
</div> -->
