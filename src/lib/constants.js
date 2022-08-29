export const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
export const autosaveOptions = ["always"];
export const themeOptions = ["dark"];
export const isURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
