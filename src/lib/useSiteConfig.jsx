import { useContext, useState, useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import { useParams, useLocation } from "react-router-dom";
import { configContext } from "../context/ConfigContext";

function useSiteConfig() {
  console.log("USE SITECONFIG", useRouteMatch(), useLocation());
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
    pinnedDirs: [],
    commands: [],
    frontmatter: [],
  };
};

export default useSiteConfig;
