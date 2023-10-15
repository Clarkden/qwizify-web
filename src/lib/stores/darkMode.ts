import { writable } from "svelte/store";

export const darkMode = writable(false);

export const changeDarkMode = () => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  darkMode.update((value) => !value);
};
