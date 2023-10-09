<script lang="ts">
  export let user: any;
</script>

<div class=" py-2 w-full grid grid-cols-2 px-2 ">
  <div class="col-span-1">
    <h2>{user.email}</h2>
  </div>
  <div class="col-span-1">
    <p class="text-green-400 text-right">{user.role}</p>
  </div>
</div>
