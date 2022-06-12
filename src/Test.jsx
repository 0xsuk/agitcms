import { useEffect, useState } from "react";
import { Editor } from "@toast-ui/react-editor";

//function Test() {
//  const [editor, setEditor] = useState(null);
//  const [showFrontmatter, setShowFrontmatter] = useState(false);
//
//  window.setShowFrontmatter = setShowFrontmatter;
//
//  useEffect(() => {
//    const e = new Editor({
//      el: document.getElementById("test"),
//      initialValue: "",
//      height: "600px",
//      frontMatter: true,
//      previewStyle: "vertical",
//    });
//
//    setEditor(e);
//  }, [showFrontmatter]);
//
//  return <div id="test"></div>;
//}
//

function Test() {
  const [showFrontmatter, setShowFrontmatter] = useState(false);

  window.s = setShowFrontmatter;

  return (
    <>
      <Editor
        previewStyle="vertical"
        initialValue=""
        frontMatter={showFrontmatter}
      />
    </>
  );
}

export default Test;
