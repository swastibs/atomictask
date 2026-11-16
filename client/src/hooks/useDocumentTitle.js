import { useEffect } from "react";

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · AtomicTasks` : "AtomicTasks — turn your chaos into wins";
  }, [title]);
}
