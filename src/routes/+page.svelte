<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import Logo from "$lib/assets/images/Logo.png";
  import Scribble from "$lib/assets/images/Scribble.png";
</script>

<div
  class="h-16 w-full border-secondary border-b flex flex-row items-center justify-between px-5"
>
  <div
    class="flex flex-row items-center justify-between mx-auto w-full sm:w-2/3 md:w-3/5"
  >
    <div>
      <!-- <img src={Logo} alt="Qwizify Logo" class="w-10 h-10" /> -->
      <a href="/" class="font-bold text-lg"
        >Qwizify
        <span class="text-xs text-green-400"> Beta </span>
      </a>
    </div>
    <div>
      <ul class="flex flex-row items-center gap-3">
        <li><Button href="/auth" class="tex-">Start Studying</Button></li>
      </ul>
    </div>
  </div>
</div>
<section
  class="h-[80vh] w-full flex flex-col items-center justify-center gap-14"
>
  <div>
    <h1 class="text-4xl md:text-5xl font-extrabold">
      <span class="relative">
        Study
        <img
          src={Scribble}
          alt="scribble"
          class="absolute left-0 right-0 w-full"
        />
      </span>
      your notes with
      <span class="text-green-400">AI</span>
    </h1>
  </div>
  <div class="flex flex-row items-center gap-3">
    <Button href="/auth">Get Started</Button>
    <Button href="#learn" variant="outline">Learn More</Button>
  </div>
  <p class="text-lg text-neutral-500 mt-20">
    Trusted by High School and College Students
  </p>
</section>
