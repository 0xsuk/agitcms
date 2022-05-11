import { useContext } from "react";
import { useRouteMatch } from "react-router-dom";
import { configContext } from "../context/ConfigContext";

function useSiteConfig() {
  const { config } = useContext(configContext);

  const match = useRouteMatch("/*/:siteKey");
  if (!match) return { siteConfig: null, isNew: null };
  const { siteKey: siteKey_str } = match.params;

  if (!siteKey_str) return { siteConfig: null, isNew: null };
  if (siteKey_str === "new")
    return { siteConfig: newSiteConfig(), isNew: true };

  const siteKey = Number(siteKey_str);
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
    key: Date.now(),
    path: "",
    defaultDir: "",
    mediaDir: "",
    pinnedDirs: [],
    commands: [],
    frontmatter: [],
  };
};

export default useSiteConfig;
