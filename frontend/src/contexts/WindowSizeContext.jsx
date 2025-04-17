import React, { createContext, useContext } from "react";
import useWindowSize from "../hooks/useWindowSize";

const WindowSizeContext = createContext(null);

export function WindowSizeProvider({ children }) {
  const windowSize = useWindowSize();

  return (
    <WindowSizeContext.Provider value={windowSize}>
      {children}
    </WindowSizeContext.Provider>
  );
}

// Custom hook to use the window size
export function useWindowSizeContext() {
  const context = useContext(WindowSizeContext);
  if (context === null) {
    throw new Error(
      "useWindowSizeContext must be used within a WindowSizeProvider"
    );
  }
  return context;
}
