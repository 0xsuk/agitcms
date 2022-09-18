import { ISiteConfig } from "@shared/types/config";

export const copyMediaFilePath = async (siteConfig: ISiteConfig) => {
  if (siteConfig.media.staticPath === "") {
    alert("please set media folder path");
    return;
  }
  //@ts-ignore can't getMediaFile from browser
  const { err, filePath, canceled } = await window.electronAPI.getMediaFile(
    siteConfig.media.staticPath,
    siteConfig.media.publicPath
  );
  if (canceled) return;
  if (err !== null) {
    alert(err);
    return;
  }

  const buf = document.createElement("input");
  document.body.appendChild(buf);
  buf.value = filePath;
  buf.select();
  document.execCommand("copy");
  document.body.removeChild(buf);
};
