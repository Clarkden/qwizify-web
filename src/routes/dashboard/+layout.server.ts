import { redirect } from "@sveltejs/kit";

export const load = async ({ cookies, url }) => {
  const sessionFromUrl = url.searchParams.get("session");

  if (sessionFromUrl) {
    cookies.set("session", sessionFromUrl);
  }

  try {
    const session = cookies.get("session");

    const response = await fetch("http://localhost:3000/auth/validate", {
      headers: {
        Authorization: `Bearer ${session}`,
      },
    });

    if (response.ok) {
      return {
        session,
      };
    }

    throw redirect(303, "/auth");

    // return response.json();
  } catch (error) {
    throw redirect(303, "/auth");
  }
};
