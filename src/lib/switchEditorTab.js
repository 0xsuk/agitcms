export const switchTab = (tab) => {
  const frontmatterEl = document.getElementById("editor-frontmatter-tab");
  const markdownEl = document.getElementById("editor-markdown-tab");
  const markdownTabEl = document.querySelectorAll(
    "#editor-navigator > .tab"
  )[0];
  const frontmatterTabEl = document.querySelectorAll(
    "#editor-navigator .tab"
  )[1];
  const isFrontmatterVisible = frontmatterEl.style.display !== "none";

  const frontmatterOn = () => {
    markdownEl.style.display = "none";
    markdownTabEl.style.borderBottom = "none";
    frontmatterEl.style.display = "block";
    frontmatterTabEl.style.borderBottom = "solid 1px red";
  };

  const markdownOn = () => {
    markdownEl.style.display = "block";
    markdownTabEl.style.borderBottom = "solid 1px red";
    frontmatterEl.style.display = "none";
    frontmatterTabEl.style.borderBottom = "none";
  };

  switch (tab) {
    case undefined:
      if (isFrontmatterVisible) {
        markdownOn();
      } else {
        frontmatterOn();
      }
      break;
    case "markdown":
      markdownOn();
      break;
    case "frontmatter":
      frontmatterOn();
      break;
  }
};
