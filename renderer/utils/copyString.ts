export const copyString = async (str: string) => {
  const buf = document.createElement("input");
  document.body.appendChild(buf);
  buf.value = str;
  buf.select();
  document.execCommand("copy");
  document.body.removeChild(buf);
};
