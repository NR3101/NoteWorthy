"use client";

import { createContext, useContext } from "react";

const EditorContext = createContext(null);

export const EditorProvider = ({ children, value }) => {
  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
};
