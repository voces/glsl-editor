import { Monaco } from "@monaco-editor/react";
import { useEffect } from "react";

import { initShaderProgram } from "./gl.ts";
import { useRenderer } from "./useRenderer.ts";

// @ts-ignore import as string
import _vshader from "./vshader.glsl";
const vshader: string = _vshader;

const toMarkers = (error: unknown) => {
  if (!(error instanceof Error)) {
    return [];
  }

  return error.message.split("\n").slice(0, -1).map((l) => {
    const parts = l.split(":");
    if (parts.length < 4) {
      return {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1000,
        endColumn: 1000,
        message: l,
        severity: 8,
      };
    }
    const lineStr = l.split(":")[2];
    const linNum = parseInt(lineStr);
    const message = l.slice(l.indexOf(lineStr) + lineStr.length + 2);

    return {
      startLineNumber: linNum,
      startColumn: 1,
      endLineNumber: linNum,
      endColumn: 1000,
      message,
      severity: 8,
    };
  }).filter(<T>(v: T | undefined): v is T => !!v);
};

export const useWebGl = (
  { canvas, shader, editor, mouse, start }: {
    canvas: HTMLCanvasElement | null;
    shader: string;
    editor: Monaco["editor"] | null;
    mouse: { x: number; y: number };
    start: number;
  },
) => {
  useEffect(() => {
    if (!canvas) return;

    const gl = canvas.getContext("webgl2");
    if (!gl) return;

    let program: WebGLProgram | null = null;
    try {
      program = initShaderProgram(gl, vshader, shader);
      editor?.removeAllMarkers("glsl-editor");
    } catch (err) {
      editor?.setModelMarkers(
        editor.getModels()[0],
        "glsl-editor",
        toMarkers(err),
      );
    }
    if (!program) return;

    gl.useProgram(program);

    return () => gl.deleteProgram(program);
  }, [canvas, shader, editor]);

  useRenderer(canvas, mouse, start, shader);
};
