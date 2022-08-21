import HelpOutlinedIcon from "@mui/icons-material/HelpOutlined";
function HelpLink({ url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      style={{ color: "inherit", textDecoration: "none" }}
    >
      <HelpOutlinedIcon sx={{ fontSize: "13px" }} />
    </a>
  );
}

export default HelpLink;
