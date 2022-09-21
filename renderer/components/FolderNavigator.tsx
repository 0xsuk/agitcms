import { pathDelimiter } from "@/utils/constants";
import * as path from "path";
interface Props {
  cwdf: string;
  onClickNewPath: (newPath: string) => void;
  root?: string;
}

const reverseString = (str: string) => str.split("").reverse().join("");

function FolderNavigator({ cwdf, root = "/", onClickNewPath }: Props) {
  const insignificantPath = path.join(root, ".."); //resolves to / if root is /
  const significantPathSplit = path
    .relative(insignificantPath, cwdf) //in path-browserify, relative internally calls posix.resolve, which calls process.cwd(), resulting in "undefined" error. That's why agit uses @0xsuk/path-browserify
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
