import { useEffect, useState } from "react";

export const useRenderer = (
  canvas: HTMLCanvasElement | null,
  mouse: { x: number; y: number },
  start: number,
  shader: string,
) => {
  const [textureNames, setTextureNames] = useState<string[]>([]);
  const [buffers, setBuffers] = useState<
    [WebGLFramebuffer, WebGLFramebuffer]
  >();

  // Constants that never change (triangles)
  useEffect(() => {
    if (!canvas) return;
    const gl = canvas.getContext("webgl2");
    if (!gl) return;

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
      gl.STATIC_DRAW,
    );
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array([0, 1, 2, 0, 2, 3]),
      gl.STATIC_DRAW,
    );
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }, [canvas]);

  // Setup textures/buffer
  useEffect(() => {
    const onSetup = () => {
      if (!canvas) return;
      const gl = canvas.getContext("webgl2");
      if (!gl) return;

      const buffer1 = gl.createFramebuffer();
      const buffer2 = gl.createFramebuffer();
      if (!buffer1 || !buffer2) return;
      // gl.viewport(0, 0, globalThis.innerWidth, globalThis.innerHeight);
      // gl.clearColor(0, 0, 0, 1);
      // gl.clear(gl.COLOR_BUFFER_BIT);

      const newTextures = Array.from(
        shader.matchAll(/uniform\s+sampler2D\s+(\w+)/g),
      ).map((m) => m[1]);
      // No change
      if (
        newTextures.length === textureNames.length &&
        newTextures.every((t, i) => t === textureNames[i])
      ) return;
      console.log("setting up", newTextures.length, "textures:", newTextures);

      for (let i = 0; i < newTextures.length; i++) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, buffer1);
        gl.activeTexture(gl[`TEXTURE${i}` as `TEXTURE0`]);
        const texture1 = gl.createTexture();
        if (!texture1) return;
        gl.bindTexture(gl.TEXTURE_2D, texture1);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          globalThis.innerWidth,
          globalThis.innerHeight,
          0,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          null,
        );

        gl.framebufferTexture2D(
          gl.FRAMEBUFFER,
          gl[`COLOR_ATTACHMENT${i}` as `COLOR_ATTACHMENT0`],
          gl.TEXTURE_2D,
          texture1,
          0,
        );

        gl.bindFramebuffer(gl.FRAMEBUFFER, buffer2);
        gl.activeTexture(gl[`TEXTURE${i}` as `TEXTURE0`]);
        const texture2 = gl.createTexture();
        if (!texture2) return;
        gl.bindTexture(gl.TEXTURE_2D, texture2);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          globalThis.innerWidth,
          globalThis.innerHeight,
          0,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          null,
        );

        gl.framebufferTexture2D(
          gl.FRAMEBUFFER,
          gl[`COLOR_ATTACHMENT${i}` as `COLOR_ATTACHMENT0`],
          gl.TEXTURE_2D,
          texture2,
          0,
        );
      }

      setBuffers([buffer1, buffer2]);
      setTextureNames(newTextures);
    };
    onSetup();
    globalThis.addEventListener("resize", onSetup);
    return () => globalThis.removeEventListener("resize", onSetup);
  }, [canvas, shader, textureNames]);

  useEffect(() => {
    if (!canvas) return;
    const gl = canvas.getContext("webgl2");
    if (!gl) return;

    let animationFrame: number;
    let flip: 0 | 1 = 0;
    const animate = () => {
      animationFrame = requestAnimationFrame(animate);
      try {
        const program = gl.getParameter(gl.CURRENT_PROGRAM);
        if (!program) return;

        gl.uniform1f(
          gl.getUniformLocation(program, "time"),
          (Date.now() - start) / 1000,
        );

        gl.uniform2f(gl.getUniformLocation(program, "mouse"), mouse.x, mouse.y);

        gl.uniform2f(
          gl.getUniformLocation(program, "resolution"),
          globalThis.innerWidth,
          globalThis.innerHeight,
        );
        canvas.width = globalThis.innerWidth;
        canvas.height = globalThis.innerHeight;
        gl.viewport(0, 0, globalThis.innerWidth, globalThis.innerHeight);

        // gl.uniform1ui(gl.getUniformLocation());

        // Render with bound textures
        // if (buffers && textureNames.length) {
        //   gl.bindFramebuffer(gl.FRAMEBUFFER, buffers[flip ? 0 : 1]);
        // for (let i = 0; i < textureNames.length; i++) {
        //   // gl.bindTexture(gl.TEXTURE_2D, textures[flip][i]);
        //   // console.log("bind", textureNames[i]);
        //   gl.uniform1i(gl.getUniformLocation(program, textureNames[i]), i);
        //   gl.activeTexture(gl.TEXTURE0 + i);
        //   gl.bindTexture(gl.TEXTURE_2D, textures[flip][i]);
        // }
        //   gl.drawBuffers(
        //     textureNames.map((_, i) =>
        //       gl[`COLOR_ATTACHMENT${i}` as `COLOR_ATTACHMENT0`]
        //     ),
        //   );
        //   gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        // }

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

        // Copy buffer outputs to inputs
        flip = flip ? 1 : 0;

        // const gl2 = c1.getContext("webgl2");
        // if (!gl2) return;
        // gl2.

        for (let i = 0; i < textureNames.length; i++) {
          gl.activeTexture(gl[`TEXTURE${i}` as `TEXTURE0`]);
          // gl.bindTexture(gl.TEXTURE_2D, textures[flip][i]);
          gl.copyTexImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            0,
            0,
            globalThis.innerWidth,
            globalThis.innerHeight,
            0,
          );
        }
      } catch (err) {
        console.error(err);
      }
    };

    animate();

    return () => cancelAnimationFrame(animationFrame);
  }, [canvas, start, textureNames, buffers]);
};
