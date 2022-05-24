import Editor from "@toast-ui/editor";
import { useEffect } from "react";

function Test() {
  useEffect(() => {
    const editor = new Editor({
      el: document.getElementById("test"),
      initialValue: "",
      height: "600px",
      frontMatter: true,
    });
  }, []);
  return <div id="test"></div>;
}

export default Test;
