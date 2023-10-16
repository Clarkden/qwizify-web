import { PUBLIC_SERVER_URL } from "$env/static/public";
import { redirect } from "@sveltejs/kit";

export const load = async ({ cookies, url }) => {
  const sessionFromUrl = url.searchParams.get("session");

  if (sessionFromUrl) {
    cookies.set("session", sessionFromUrl);
  }

  try {
    const session = cookies.get("session");

    const response = await fetch(`${PUBLIC_SERVER_URL}/auth/validate`, {
      headers: {
        Authorization: `Bearer ${session}`,
      },
    });

    const data = await response.json();

    if (!data.userId) {
      cookies.delete("session");

      return;
    }

    // return response.json();
  } catch (error) {
    console.log(error);
    cookies.delete("session");

    return;
  }
  throw redirect(303, "/dashboard");
};
