import { useContext } from "react";
import { useRouteMatch } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { configContext } from "../context/ConfigContext";

function useSiteConfig() {
  const { config } = useContext(configContext);

  const match = useRouteMatch("/*/:siteKey");
  if (!match) return null;
  const { siteKey } = match.params;

  if (!siteKey) return null;

  let siteConfig;
  config.sites.every((site) => {
    if (site.key === siteKey) {
      siteConfig = site;
      return false;
    }
    return true;
  });

  return siteConfig;
}

export const FrontmatterLanguages = ["yaml", "toml"];

export const newSiteConfig = () => {
  return {
    name: "",
    key: uuid(),
    path: "",
    frontmatterLanguage: "yaml",
    frontmatterDelimiter: "---",
    media: {
      staticPath: "",
      publicPath: "",
    },
    pinnedDirs: [],
    frontmatter: [],
    tools: null, //TODO: load extension here
  };
};

export default useSiteConfig;
