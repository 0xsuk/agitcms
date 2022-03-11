import { useContext } from "react";
import { useParams } from "react-router-dom";
import { configContext } from "../context/ConfigContext";

function useSiteConfig() {
  const { config } = useContext(configContext);
  const params = useParams();
  if (params.siteKey === "new")
    return { siteConfig: newSiteConfig(), isNew: true };
  const siteKey = Number(params.siteKey);
  if (!siteKey) return { siteConfig: null, isNew: null };
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
  };
};

export default useSiteConfig;
