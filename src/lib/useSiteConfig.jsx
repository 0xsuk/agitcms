import { useContext } from "react";
import { useParams } from "react-router-dom";
import { configContext } from "../context/ConfigContext";

function useSiteConfig() {
  const { config } = useContext(configContext);
  const { siteKey: siteKey_str } = useParams();

  if (siteKey_str === "new")
    return { siteConfig: newSiteConfig(), isNew: true };
  if (!siteKey_str) return { siteConfig: null, isNew: null };

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
    commands: [],
    frontmatter: [],
  };
};

export default useSiteConfig;
