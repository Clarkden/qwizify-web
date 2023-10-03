import { redirect } from '@sveltejs/kit';

export const load = async ({ cookies, params }) => {
  const { id } = params;
  try {
    const session = cookies.get("session");

    const response = await fetch("http://localhost:3000/document/" + id, {
        method: "GET",
      headers: {
        Authorization: `Bearer ${session}`,
      },
    });

    if (response.ok) {
      return {
        doc: await response.json(),
      };
    }
  } catch (error) {
    console.log(error);
  }

  throw redirect(303, "/dashboard")
};
