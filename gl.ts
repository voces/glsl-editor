export const initShaderProgram = (
  gl: WebGL2RenderingContext,
  vsSource: string,
  fsSource: string,
) => {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  if (!shaderProgram) throw new Error("Error creating program");

  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    throw new Error(
      `Unable to initialize the shader program: ${
        gl.getProgramInfoLog(
          shaderProgram,
        )
      }`,
    );
  }

  return shaderProgram;
};

export const loadShader = (
  gl: WebGL2RenderingContext,
  type: WebGL2RenderingContext["VERTEX_SHADER" | "FRAGMENT_SHADER"],
  source: string,
) => {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Error creating sahder");

  // Send the source to the shader object
  gl.shaderSource(shader, source);

  // Compile the shader program
  gl.compileShader(shader);

  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(
      gl.getShaderInfoLog(shader) ?? "Unknown shader compilation error",
    );
  }

  return shader;
};
