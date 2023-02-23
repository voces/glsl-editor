import { Monaco } from "@monaco-editor/react";
import { useEffect } from "react";

import { conf, language } from "./glsl.ts";

export const useSetupMonaco = (monaco: Monaco, loaded: () => void) => {
  useEffect(() => {
    if (!monaco) return;

    monaco.languages.register({ id: "glsl" });
    monaco.languages.setMonarchTokensProvider("glsl", language);
    monaco.languages.setLanguageConfiguration("glsl", conf);

    monaco.editor.defineTheme("TestMonaco", {
      base: "vs-dark",
      inherit: true,
      rules: [{ background: "#1e1e1e" }],
      colors: {
        "editor.background": "#1e1e1e00",
        "editor.lineHighlightBackground": "#1e1e1e33",
      },
    });

    loaded();
  }, [monaco]);
};
