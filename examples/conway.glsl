#version 300 es

precision highp float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D previous;

out vec4 fragColor;

void main() {
    vec2 st = gl_FragCoord.xy/resolution;
    vec2 mt = mouse/resolution;

    float vh = 1./resolution.y;
    float vw = 1./resolution.x;

    float d = pow(pow(mouse.x - gl_FragCoord.x, 2.) + pow(mouse.y - gl_FragCoord.y, 2.), 0.5);

    float neighbors = texture(previous, st + vec2(vw, vh)).r
        + texture(previous, st + vec2(vw, 0)).r
        + texture(previous, st + vec2(vw, -vh)).r
        + texture(previous, st + vec2(0, vh)).r
        + texture(previous, st + vec2(0, -vh)).r
        + texture(previous, st + vec2(-vw, vh)).r
        + texture(previous, st + vec2(-vw, 0)).r
        + texture(previous, st + vec2(-vw, -vh)).r;

    float c = 0.;

    if (neighbors == 3.) c = 1.0;
    else if (d < 10.) c = 1.0;
    else if (neighbors == 2.) c = texture(previous, st).r;
    
    fragColor = vec4(vec3(c), 1.);
}