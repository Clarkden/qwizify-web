<script lang="ts">
  import { Button } from "$lib/components/ui/button";
</script>

<div
  class="h-16 w-full border-secondary border-b flex flex-row items-center justify-between px-5"
>
  <div class="flex flex-row items-center justify-between mx-auto w-full">
    <div>
      <a href="/" class="font-bold text-2xl"
        >Qwizify
        <span class="text-sm text-primary font-normal"> Beta </span>
      </a>
    </div>
    <div>
      <ul class="flex flex-row items-center gap-3">
        <!-- <li><Button variant="link" href="/sign-up">Sign Up</Button></li> -->
        <li><Button href="/auth">Start Studying</Button></li>
      </ul>
    </div>
  </div>
</div>
