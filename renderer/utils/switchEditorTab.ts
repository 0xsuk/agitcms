export const switchTab = (tab: string | undefined) => {
  const frontmatterEl = document.getElementById(
    "editor-frontmatter-tab"
  ) as HTMLElement;
  const markdownEl = document.getElementById(
    "editor-markdown-tab"
  ) as HTMLElement;
  const markdownTabEl = document.querySelectorAll(
    "#editor-navigator > .tab"
  )[0] as HTMLElement;
  const frontmatterTabEl = document.querySelectorAll(
    "#editor-navigator .tab"
  )[1] as HTMLElement;
  const isFrontmatterVisible = frontmatterEl.style.display !== "none";

  const frontmatterOn = () => {
    markdownEl.style.display = "none";
    markdownTabEl.style.borderBottom = "none";
    frontmatterEl.style.display = "block";
    frontmatterTabEl.style.borderBottom = "solid 1px red";
  };

  const markdownOn = () => {
    markdownEl.style.display = "flex"; //not block
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
