#version 300 es

#ifdef GL_ES
precision mediump float;
#endif

in vec4 position;

void main() {
    gl_Position = position;
}
