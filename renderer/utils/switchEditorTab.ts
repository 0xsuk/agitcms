const borderBottom = "solid 1px red";

export const switchTab = (tab: "markdown" | "frontmatter" | "media") => {
  const frontmatterEl = document.getElementById(
    "editor-frontmatter-tab"
  ) as HTMLElement;
  const markdownEl = document.getElementById(
    "editor-markdown-tab"
  ) as HTMLElement;
  const mediaEl = document.getElementById("editor-media-tab") as HTMLElement;
  const markdownTabEl = document.querySelectorAll(
    "#editor-navigator > .tab"
  )[0] as HTMLElement;
  const frontmatterTabEl = document.querySelectorAll(
    "#editor-navigator .tab"
  )[1] as HTMLElement;
  const mediaTabEl = document.querySelectorAll(
    "#editor-navigator .tab"
  )[2] as HTMLElement;

  const markdownOff = () => {
    markdownEl.style.display = "none";
    markdownTabEl.style.borderBottom = "none";
  };
  const frontmatterOff = () => {
    frontmatterEl.style.display = "none";
    frontmatterTabEl.style.borderBottom = "none";
  };
  const mediaOff = () => {
    mediaEl.style.display = "none";
    mediaTabEl.style.borderBottom = "none";
  };

  const frontmatterOn = () => {
    frontmatterEl.style.display = "block";
    frontmatterTabEl.style.borderBottom = borderBottom;
    markdownOff();
    mediaOff();
  };

  const markdownOn = () => {
    markdownEl.style.display = "flex"; //not block
    markdownTabEl.style.borderBottom = borderBottom;
    frontmatterOff();
    mediaOff();
  };

  const mediaOn = () => {
    mediaEl.style.display = "block";
    mediaTabEl.style.borderBottom = borderBottom;
    frontmatterOff();
    markdownOff();
  };

  switch (tab) {
    case "markdown":
      markdownOn();
      break;
    case "frontmatter":
      frontmatterOn();
      break;
    case "media":
      mediaOn();
      break;
  }
};
