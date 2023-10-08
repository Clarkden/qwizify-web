<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import Logo from "$lib/assets/images/Logo.png"
</script>

<div
  class="h-16 w-full border-secondary border-b flex flex-row items-center justify-between px-5"
>
<div class="flex flex-row items-center justify-between mx-auto w-full sm:w-2/3 md:w-3/5">

  <div>
    <!-- <img src={Logo} alt="Qwizify Logo" class="w-10 h-10" /> -->
    <a href="/" class="font-bold text-lg">Qwizify</a>
  </div>
  <div>
    <ul class="flex flex-row items-center gap-3">
      <li><Button href="/auth" class="tex-">Start Studying</Button></li>
    </ul>
  </div>
  </div>
</div>
