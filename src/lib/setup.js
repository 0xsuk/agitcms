import { createTool } from "../lib/plugin";

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
const setPlugins = async () => {
  const res = await window.electronAPI.loadPlugins();
  if (res.err) {
    alert(res.err);
    return;
  }
  window.createTool = createTool;
  let plugins = [];
  res.plugins.forEach((plugin) => {
    plugins.push(eval(plugin.raw));
  });

  console.log(plugins);
};

export const setup = (config) => {
  setZoom(config);
  setTheme(config);
  setPlugins();
};
