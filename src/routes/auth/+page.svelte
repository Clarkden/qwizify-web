<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";

  let email: string;
  let password: string;
  let confirmPassword: string;
  let error: string;

  //   const signIn = async () => {
  //     error = "";

  //     if (!email || !password) {
  //       error = "Please fill out all fields";
  //       return;
  //     }

  //     try {
  //       const response = await fetch("http://127.0.0.1:3000/auth/sign-up", {
  //         method: "POST",
  //         body: JSON.stringify({
  //           email,
  //           password,
  //         }),
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         credentials: "include",
  //       });
  //       const data = await response.json();

  //       window.location.replace("/dashboard");
  //     } catch (error: any) {
  //       console.log(error.message);
  //       error = error.message;
  //     }
  //   };

  const googleSignIn = async () => {
    try {
      const response = await fetch("http://127.0.0.1:3000/oauth/google", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();

      window.location.href = data.url;
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const appleSignIn = async () => {
    try {
      const response = await fetch("http://127.0.0.1:3000/oauth/apple", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      window.location.href = data.url;
    } catch (error: any) {
      console.log(error.message);
    }
  };
</script>

<section class="flex flex-row items-center justify-center h-screen w-screen">
  <Card.Root class="w-11/12 md:w-[500px] md:min-w-[500px] h-fit border-accent">
    <Card.Header>
      <Card.Title>Sign Up</Card.Title>
      <Card.Description>Sign up with Studify</Card.Description>
    </Card.Header>
    <Card.Content>
      <Button on:click={googleSignIn} class="w-full mb-4">Google</Button>
      <Button on:click={appleSignIn} class="w-full mb-4">Apple</Button>
      {#if error}
        <p class="text-red-500">{error}</p>
      {/if}
    </Card.Content>
  </Card.Root>
</section>
