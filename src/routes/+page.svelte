<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import Logo from "$lib/assets/images/Logo.png";
  import Scribble from "$lib/assets/images/Scribble.png";
</script>

<main class="pb-20">
  <section
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
  </section>
  <section
    class="h-[80vh] w-full flex flex-col items-center justify-center gap-14"
  >
    <div>
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center">
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
    <div class="flex flex-col gap-2 items-center">
      <p class="max-w-[400px] text-center mb-4 text-sm sm:text-base md:text-lg">
        Qwizify turns your notes into study material in seconds powered by GPT.
      </p>
      <div class="flex flex-row items-center gap-3">
        <Button href="/auth">Get Started</Button>
        <Button href="#learn" variant="outline">Learn More</Button>
      </div>
    </div>
  </section>
  <section
    class="w-full h-16 bg-gradient-to-r from-transparent via-neutral-900 to-transparent backdrop-blur-2xl flex flex-row items-center justify-center"
  >
    <p class="text-neutral-400 font-light">
      Trusted by High School and College Students
    </p>
  </section>
  <section
    class="h-fit mx-auto w-11/12 sm:w-2/3 md:w-4/5 my-20 items-start justify-around grid gap-10 md:grid-cols-2"
  >
    <div class="flex justify-start items-center">
      <h2 class="text-3xl font-bold">It's This Simple</h2>
    </div>
    <div
      class="grid grid-cols-1 grid-flow-row divide-y divide-secondary border border-secondary rounded-lg overflow-hidden shadow-green-400/20 shadow-2xl"
    >
      <div
        class="h-fit col-span-1 bg-neutral-900 hover:shadow-lg hover:shadow-green-400 transition p-5 relative z-50"
      >
        <div class="flex gap-2 items-center mb-2">
          <div
            class="rounded-full bg-white/25 w-6 h-6 text-white flex items-center justify-center"
          >
            <p class="font-bold">1</p>
          </div>
          <h4 class="text-xl font-bold">Create</h4>
        </div>
        <p>Create a new document in your dashboard</p>
      </div>

      <div
        class="h-fit col-span-1 bg-neutral-900 hover:shadow-lg hover:shadow-green-400 transition p-5 relative z-50"
      >
        <div class="flex gap-2 items-center mb-2">
          <div
            class="rounded-full bg-white/25 w-6 h-6 text-white flex items-center justify-center"
          >
            <p class="font-bold">2</p>
          </div>
          <h4 class="text-xl font-bold">Add</h4>
        </div>
        <p>Add your notes to the document</p>
      </div>
      <div
        class="h-fit col-span-1 bg-neutral-900 hover:shadow-lg hover:shadow-green-400 transition p-5 relative z-50"
      >
        <div class="flex gap-2 items-center mb-2">
          <div
            class="rounded-full bg-white/25 w-6 h-6 text-white flex items-center justify-center"
          >
            <p class="font-bold">3</p>
          </div>
          <h4 class="text-xl font-bold">Generate</h4>
        </div>
        <p>
          Generate study material from your notes with the click of a button
        </p>
      </div>
      <div
        class="h-fit col-span-1 bg-neutral-900 hover:shadow-lg hover:shadow-green-400 transition p-5 relative z-50"
      >
        <div class="flex gap-2 items-center mb-2">
          <div
            class="rounded-full bg-white/25 w-6 h-6 text-white flex items-center justify-center"
          >
            <p class="font-bold">4</p>
          </div>
          <h4 class="text-xl font-bold">Study</h4>
        </div>
        <p>Study your notes with the generated study material</p>
      </div>
    </div>
  </section>
  <section class="h-fit mx-auto w-11/12 sm:w-2/3 md:w-3/5 my-20">
    <!-- Pricing section with the header simple pricing with two pricing options -->
    <div class="flex justify-center items-center">
      <h2 class="text-3xl font-bold">Simple Pricing</h2>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 grid-flow-row gap-10 mt-10">
      <div
        class="h-[200px] col-span-1 border-2 border-secondary bg-neutral-900 rounded-lg hover:shadow-lg hover:shadow-green-400 transition p-5 relative z-50"
      >
        <h4 class="text-xl font-bold mb-4">Free</h4>
        <p>3 Documents</p>
        <p>16 Cards per Set</p>
        <p>GPT-3</p>
      </div>

      <div
        class="h-[200px] col-span-1 border-2 border-secondary bg-neutral-900 rounded-lg hover:shadow-lg hover:shadow-green-400 transition p-5 relative z-50"
      >
        <h4 class="text-xl font-bold mb-4">Premium</h4>
        <p>Unlimited Documents</p>
        <p>Unlimited Cards per Set</p>
        <p>GPT-4</p>
      </div>
    </div>
  </section>
</main>
