<script>
  import "../app.css";
  import { dev } from "$app/environment";
  import { inject } from "@vercel/analytics";

  inject({ mode: dev ? "development" : "production" });
</script>

<body class="bg-background text-white flex flex-col min-h-screen">
  <slot />
</body>
