import { PUBLIC_SERVER_URL } from "$env/static/public";
import { redirect } from "@sveltejs/kit";

export const load = async ({ cookies, url }) => {
  try {
    const response = await fetch(`${PUBLIC_SERVER_URL}/admin/validate`, {
      headers: {
        Authorization: `Bearer ${cookies.get("session")}`,
      },
    });

    if (response.status === 200) {
      return;
    }
  } catch (error) {
    console.log(error);
  }

  throw redirect(303, "/dashboard");
};
