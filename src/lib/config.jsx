import { useContext } from "react";
import { useParams } from "react-router-dom";
import { configContext } from "../context/ConfigContext";

export const useSiteConfig = () => {
  const { config } = useContext(configContext);
  const siteKey = Number(useParams().siteKey);
  if (!siteKey) return [undefined, undefined];
  let siteConfig;
  config.sites.every((site) => {
    if (site.key === siteKey) {
      console.log(site);
      siteConfig = site;
      return false;
    }
    return true;
  });

  return [siteKey, siteConfig];
};

export const newSiteConfig = () => {
  return {
    key: Date.now(),
    path: "",
    defaultDir: "",
    mediaDir: "",
  };
};
