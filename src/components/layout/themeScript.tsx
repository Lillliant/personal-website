const themeScript = `
  try {
    var t = localStorage.getItem("app-theme");
    var dark = t === "dark" || (!t && window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  } catch (e) {}
`;

export function ThemeScript() {
  return <script>{themeScript}</script>;
}
