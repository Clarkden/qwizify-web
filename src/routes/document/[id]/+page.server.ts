import { PUBLIC_SERVER_URL } from "$env/static/public";
import { redirect } from "@sveltejs/kit";

export const load = async ({ params }) => {
  try {
    const response = await fetch(`${PUBLIC_SERVER_URL}/document/public/` + params.id);

    if (response.ok) {
      return {
        doc: await response.json(),
      };
    }
  } catch (error) {
    console.log(error);
  }

  throw redirect(303, "/NotFound");
};
