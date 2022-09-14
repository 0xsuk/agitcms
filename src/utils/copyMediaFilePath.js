export const copyMediaFilePath = async (siteConfig) => {
  if (siteConfig.media.staticPath === "") {
    alert("please set media folder path");
    return;
  }
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
