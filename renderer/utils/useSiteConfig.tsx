import { configContext } from "@/context/ConfigContext";
import { ISiteConfig } from "@shared/types/config";
import { randomid } from "@shared/utils/randomid";
import { useContext } from "react";
import { useRouteMatch } from "react-router-dom";

function useSiteConfig(): null | ISiteConfig {
  const { config } = useContext(configContext);
  if (!config) return null;

  const match = useRouteMatch<{ siteKey: string }>("/*/:siteKey");
  if (!match) return null;
  const { siteKey } = match.params;

  let siteConfig: ISiteConfig | undefined;
  config.sites.every((site) => {
    if (site.key === siteKey) {
      siteConfig = site;
      return false;
    }
    return true;
  });
  if (!siteConfig)
    throw Error("site config for key=" + siteKey + " was not found");

  return siteConfig;
}

export const FrontmatterLanguages = ["yaml", "toml"];

export const newSiteConfig = (name: string, path: string): ISiteConfig => {
  return {
    name,
    key: randomid(),
    path,
    frontmatterLanguage: "yaml",
    frontmatterDelimiter: "---",
    media: {
      staticPath: "",
      publicPath: "",
    },
    pinnedDirs: [{ name: path.split("/").reverse()[0], path, isDir: true }],
    frontmatter: [],
  };
};

export default useSiteConfig;
