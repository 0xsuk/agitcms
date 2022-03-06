export const findSiteConfigBySiteKey = (config, siteKey) => {
  if (!config.sites) return;
  let siteConfig;
  config.sites.every((site, i) => {
    if (site.key == siteKey) {
      siteConfig = site;
      return false;
    }
    return true;
  });

  return siteConfig;
};

export const newSiteConfig = () => {
  return {
    key: Date.now(),
    path: "",
    defaultDir: "",
    mediaDir: "",
  };
};
