export const autosaveOptions = ["always"];
export const themeOptions = ["dark"];
export const isURL = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
