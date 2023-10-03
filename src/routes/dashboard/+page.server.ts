export const load = async ({ cookies, url }) => {
  try {
    url.searchParams.delete("session");
  } catch (error) {
    console.log(error);
  }
};
