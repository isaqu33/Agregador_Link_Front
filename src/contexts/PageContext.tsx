import { createContext, useCallback, useContext, useEffect, useState } from "react";

// Which page of the account the panel is editing: "" = main page, otherwise the id of an extra page.
interface PageCtx {
  pageId: string;
  setPageId: (id: string) => void;
}

const PageContext = createContext<PageCtx>({ pageId: "", setPageId: () => {} });
const STORAGE_KEY = "facelink-page";

export function PageProvider({ children }: { children: React.ReactNode }) {
  const [pageId, setPageIdState] = useState("");

  // remember the choice for this browser tab only
  useEffect(() => {
    try {
      setPageIdState(sessionStorage.getItem(STORAGE_KEY) ?? "");
    } catch {}
  }, []);

  const setPageId = useCallback((id: string) => {
    setPageIdState(id);
    try {
      id ? sessionStorage.setItem(STORAGE_KEY, id) : sessionStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  return <PageContext.Provider value={{ pageId, setPageId }}>{children}</PageContext.Provider>;
}

export const usePageContext = () => useContext(PageContext);
