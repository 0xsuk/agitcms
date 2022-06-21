import { v4 as uuid } from "uuid";
import { useContext } from "react";
import { useRouteMatch } from "react-router-dom";
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

export const FrontmatterTypes = [
  { name: "Text", type: "Text" },
  { name: "List of Text", type: "Array.Text" },
  { name: "Multiline Text", type: "Multiline-Text" },
  { name: "Date", type: "Date" },
  { name: "Bool", type: "Bool" },
];

export const FrontmatterTypeToName = (type) => {
  for (let i = 0; FrontmatterTypes.length > i; i++) {
    if (FrontmatterTypes[i].type === type) {
      return FrontmatterTypes[i].name;
    }
  }
};

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
  };
};

export default useSiteConfig;
