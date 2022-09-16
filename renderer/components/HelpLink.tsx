import HelpOutlinedIcon from "@mui/icons-material/HelpOutlined";
interface Props {
  url: string;
}
function HelpLink({ url }: Props) {
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
