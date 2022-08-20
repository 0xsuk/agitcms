export const editorSetup = async ({
  setMediaPort,
  mediaStaticPath,
  mediaPublicPath,
}) => {
  const port = await window.electronAPI.startMediaServer(
    mediaStaticPath,
    mediaPublicPath
  );
  if (port === undefined) {
    alert("Error occured setting media port");
    return;
  }
  setMediaPort(port);
};
