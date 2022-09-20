import { pathDelimiter } from "@/utils/constants";
import * as path from "path";
interface Props {
  root: string;
  cwdf: string;
  onClickNewPath: (newPath: string) => void;
}

const reverseString = (str: string) => str.split("").reverse().join("");

function FolderNavigator({ cwdf, root, onClickNewPath }: Props) {
  const insignificantPath = path.join(root, "..");
  const significantPathSplit = path
    .relative(insignificantPath, cwdf)
    .split("/");

  return (
    <span id="folder-navigator">
      {significantPathSplit
        .map((p, i) => (
          <>
            <span
              className="accent hpointer"
              style={{ padding: "0 2px" }}
              onClick={() => {
                const newPath = path.join(
                  insignificantPath,
                  ...significantPathSplit.slice(0, i + 1)
                );
                onClickNewPath(newPath);
              }}
            >
              {reverseString(p)}
            </span>
            {i == 0 && root === "/" ? (
              <span
                className="accent hpointer"
                onClick={() => {
                  onClickNewPath("/");
                }}
              >
                {pathDelimiter}
              </span>
            ) : (
              pathDelimiter
            )}
          </>
        ))
        .reverse()}
      {insignificantPath !== "/" &&
        reverseString(insignificantPath).replaceAll("/", pathDelimiter)}
    </span>
  );
}

export default FolderNavigator;