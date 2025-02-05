import { redirect } from "@sveltejs/kit";
import { PUBLIC_SERVER_URL } from "$env/static/public";

export const load = async ({ cookies, params }) => {
  const { id } = params;
  try {
    const session = cookies.get("session");

    

    const response = await fetch(`${PUBLIC_SERVER_URL}/document/flash-cards/` + id, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session}`,
      },
    });

    if (response.ok) {
      return {
        flashCards: await response.json(),
      };
    }
  } catch (error) {
    console.log(error);

    return {
      flashCards: []
    }
  }

  return {
    flashCards: []
  }

  // throw redirect(303, "/dashboard");
};
