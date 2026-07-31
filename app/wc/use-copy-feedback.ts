import { useEffect, useRef, useState } from "haunted";

export type CopyStatus = "idle" | "copied" | "error";

export function useCopyFeedback() {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(
    () => () => {
      if (resetTimer.current !== undefined) {
        clearTimeout(resetTimer.current);
      }
    },
    []
  );

  const showStatus = (
    status: Exclude<CopyStatus, "idle">,
    duration: number
  ) => {
    if (resetTimer.current !== undefined) {
      clearTimeout(resetTimer.current);
    }

    setCopyStatus(status);
    resetTimer.current = setTimeout(() => {
      resetTimer.current = undefined;
      setCopyStatus("idle");
    }, duration);
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showStatus("copied", 1200);
    } catch {
      showStatus("error", 2000);
    }
  };

  return { copy, copyStatus };
}
