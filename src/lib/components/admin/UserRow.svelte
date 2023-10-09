<script lang="ts">
  export let user: any;
</script>

<div class="border border-secondary rounded-md p-5 bg-background w-full">
  <h2 class="font-bold">{user.email}</h2>
  <p class="text-muted-primary">{user.role}</p>
</div>
