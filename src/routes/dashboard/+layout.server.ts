import { redirect } from "@sveltejs/kit";
import { PUBLIC_SERVER_URL } from "$env/static/public";

export const load = async ({ cookies, url }) => {
  const sessionFromUrl = url.searchParams.get("session");

  if (sessionFromUrl) {
    cookies.set("session", sessionFromUrl);
    try {
      console.log(url.searchParams.delete("session"));
      url.searchParams.delete("session");
    } catch (error) {
      console.log(error);
    }
  }

  console.log('validating')

  try {
    const session = cookies.get("session");

    const response = await fetch(`${PUBLIC_SERVER_URL}/auth/validate`, {
      headers: {
        Authorization: `Bearer ${session}`,
      },
    });

    if (response.ok) {
      return {
        session,
        user: await response.json(),
      };
    }

    throw redirect(303, "/auth");

    // return response.json();
  } catch (error) {
    throw redirect(303, "/auth");
  }
};
