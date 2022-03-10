const { useState } = require("react");
const { newSiteConfig } = require("../../../lib/config");

function NewSite() {
  const [siteConfig, setSiteConfig] = useState(newSiteConfig());

  return (
    <div>
      <h2>Create a new site</h2>
    </div>
  );
}

export default NewSite;
