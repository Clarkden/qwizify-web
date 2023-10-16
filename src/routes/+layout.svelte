<script>
  import { onMount } from "svelte";
  import "../app.css";
  import { darkMode } from "$lib/stores/darkMode";
  import { browser } from "$app/environment";

  onMount(() => {
    if (browser && document) {
      // const theme = localStorage.getItem("theme");

      // if (theme) {
      //   document.body.classList.add(theme);
      //   darkMode.set(theme === "dark");
      // }
      // if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      //   document.documentElement.classList.add("dark");
      //   darkMode.set(true);
      // } else {
      //   document.documentElement.classList.remove("dark");
      //   darkMode.set(false);
      // }
    }

    // darkMode.subscribe((value) => {
    //   if (value) {
    //     document.body.classList.add("dark");
    //     document.body.classList.remove("light");
    //     localStorage.setItem("theme", "dark");
    //   } else {
    //     document.body.classList.add("light");
    //     document.body.classList.remove("dark");
    //     localStorage.setItem("theme", "light");
    //   }

    // });
  });
</script>

<body class="bg-background text-foreground flex flex-col min-h-screen">
  <slot />
</body>
