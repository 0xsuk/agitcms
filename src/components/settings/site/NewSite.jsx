import useSiteConfigBuffer from "../../../lib/useSiteConfigBuffer";
const { newSiteConfig } = require("../../../lib/useSiteConfig");

function NewSite() {
  ///TODO: useSiteConfigBuffer
  const [siteConfig] = useSiteConfigBuffer(newSiteConfig());

  return (
    <div>
      <h2>Create a new site</h2>
      <p>{siteConfig.key}</p>
    </div>
  );
}

export default NewSite;
