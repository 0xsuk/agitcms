import { useCallback, useContext, useEffect } from "react";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";

function useBlocker(blocker, when = true) {
  const { navigator } = useContext(NavigationContext);

  useEffect(() => {
    if (!when) return;

    console.log("blocked!");
    const unblock = navigator.block((tx) => {
      const autoUnblockingTx = {
        ...tx,
        retry() {
          unblock();
          tx.retry();
        },
      };

      blocker(autoUnblockingTx);
    });
    //window.addEventListener("beforeunload", async () => {
    //  unblock();
    //  while (typeof window !== undefined) {
    //    window.close();
    //  }
    //  //window.electronAPI.kill("CONFIRM")
    //  //if (await window.electronAPI.confirm("Cont")) {
    //  //  window.close();
    //  //} else {
    //  //  console.log("do something else");
    //  //}
    //});

    return unblock;
  }, [navigator, blocker, when]);
}

function usePrompt(message, when = true) {
  const blocker = useCallback(
    (tx) => {
      if (window.confirm(message)) tx.retry();
    },
    [message]
  );

  useBlocker(blocker, when);
}

export default usePrompt;
