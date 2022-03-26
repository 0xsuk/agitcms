import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import { useRef } from "react";

function Test() {
  const ref = useRef(null);
  const handleClick = () => {
    const md = ref.current.getInstance().getMarkdown();
    console.log(md);
  };

  return (
    <>
      <Editor previewStyle="vertical" height="100%" ref={ref} />
      <button onClick={handleClick}>save</button>
    </>
  );
}

export default Test;
