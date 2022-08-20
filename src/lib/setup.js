const setZoom = (config) => {
  window.electronAPI.webFrames.setZoomFactor(config.zoom);
};
const setTheme = (config) => {
  if (config.theme === "dark") {
    import(
      /* webpackMode: "eager" */ "github-markdown-css/github-markdown-dark.css"
    );
  } else {
    import(
      /* webpackMode: "eager" */ "github-markdown-css/github-markdown-light.css"
    );
  }
};

export const setup = (config) => {
  setZoom(config);
  setTheme(config);
};
