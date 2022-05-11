import { v4 as uuid } from "uuid";
import { useContext } from "react";
import { useRouteMatch } from "react-router-dom";
import { configContext } from "../context/ConfigContext";

function useSiteConfig() {
  const { config } = useContext(configContext);

  const match = useRouteMatch("/*/:siteKey");
  if (!match) return { siteConfig: null, isNew: null };
  const { siteKey } = match.params;

  if (!siteKey) return { siteConfig: null, isNew: null };
  if (siteKey === "new") return { siteConfig: newSiteConfig(), isNew: true };

  let siteConfig;
  config.sites.every((site) => {
    if (site.key === siteKey) {
      siteConfig = site;
      return false;
    }
    return true;
  });

  return { siteConfig, isNew: false };
}

export const newSiteConfig = () => {
  return {
    key: uuid(),
    path: "",
    defaultDir: "",
    mediaDir: "",
    pinnedDirs: [],
    commands: [],
    frontmatter: [],
  };
};

export default useSiteConfig;
