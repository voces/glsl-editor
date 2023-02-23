import { useEffect, useRef, useState } from "react";

export const useInputHooks = () => {
  const mouse = useRef({ x: 0, y: 0 }).current;
  const [hideEditor, setHideEditor] = useState(false);

  useEffect(() => {
    const keyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setHideEditor((h) => !h);
    };
    globalThis.addEventListener("keydown", keyDown);

    const mouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = globalThis.innerHeight - e.clientY;
    };
    globalThis.addEventListener("mousemove", mouseMove);

    return () => {
      globalThis.removeEventListener("keydown", keyDown);
      globalThis.removeEventListener("mousemove", mouseMove);
    };
  }, []);

  return { mouse, hideEditor };
};
