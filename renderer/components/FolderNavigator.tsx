import * as path from "path";
interface Props {
  cwdf: string;
  onClickNewPath: (newPath: string) => void;
  root?: string;
}

const reverseString = (str: string) => str.split("").reverse().join("");

//cwdf is always posix
function FolderNavigator({ cwdf, root = "/", onClickNewPath }: Props) {
  const insignificantPath = path.join(root, ".."); //resolves to / if root is /
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
                {"/"}
              </span>
            ) : (
              "/"
            )}
          </>
        ))
        .reverse()}
      {insignificantPath !== "/" && reverseString(insignificantPath)}
    </span>
  );
}

export default FolderNavigator;
