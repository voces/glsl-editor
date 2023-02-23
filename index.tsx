import "./style.css";
import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom";
import Editor, { useMonaco } from "@monaco-editor/react";

import { useSetupMonaco } from "./useSetupMonaco.ts";
import { useInputHooks } from "./useInputHooks.ts";
import { useWebGl } from "./useWebGL.ts";

// @ts-ignore import as string
import _fshader from "./fshader.glsl";
const fshader: string = localStorage.getItem("shader") ?? _fshader;

// @ts-ignore import as string
import _vshader from "./vshader.glsl";
const vshader: string = _vshader;

const start = Date.now();

const App = () => {
  const monaco = useMonaco();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [themeLoaded, setThemeLoaded] = useState(false);
  const [shader, setShader] = useState(fshader);
  const { mouse, hideEditor } = useInputHooks();

  useSetupMonaco(monaco, () => setThemeLoaded(true));

  useWebGl({
    canvas: canvasRef.current,
    shader,
    mouse,
    editor: monaco?.editor,
    start,
  });

  useEffect(() => localStorage.setItem("shader", shader), [shader]);

  return (
    <>
      <canvas ref={canvasRef}></canvas>
      <Editor
        height="100vh"
        defaultLanguage="glsl"
        defaultValue={fshader}
        className={`editor ${hideEditor ? "hidden" : ""}`}
        theme={themeLoaded ? "TestMonaco" : "vs-dark"}
        options={{ minimap: { enabled: false } }}
        onChange={(e) => e && setShader(e)}
      />
    </>
  );
};

createRoot(
  document.getElementById("app") ??
    document.body.appendChild(document.createElement("div")),
).render(<App />);
