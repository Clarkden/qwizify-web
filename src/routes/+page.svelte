<script lang="ts">
  import { Button } from "$lib/components/ui/button";
</script>

<div
  class="h-16 w-full border-secondary border-b flex flex-row items-center justify-between px-5"
>
  <div>
    <a href="/" class="font-bold text-lg">Qwizify</a>
  </div>
  <div>
    <ul class="flex flex-row items-center gap-3">
      <li><Button href="/auth" class="tex-">Start Studying</Button></li>
    </ul>
  </div>
</div>
