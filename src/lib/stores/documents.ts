import { writable } from "svelte/store";

export const deletedDocument = writable(false);

export const documentTitleUpdate = writable({
  title: "",
  id: "",
});
