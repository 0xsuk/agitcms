export const findSiteConfigBySiteKey = (config, siteKey) => {
  if (!config.sites) return;
  let siteConfig;
  config.sites.every((site) => {
    if (site.key === siteKey) {
      console.log(site);
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
