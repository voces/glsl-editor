#version 300 es

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 u_mouse;
uniform float time;

out vec4 fragColor;

void main() {
    vec2 st = gl_FragCoord.xy/resolution.xy;
    st.x *= resolution.x/resolution.y;

    vec3 color = vec3(0.);
    color = vec3(abs(sin(st.x+time)), abs(sin(st.y+time*1.1)), abs(sin(st.x+st.y+time*1.2)));

    fragColor = vec4(color,1.0);
}
