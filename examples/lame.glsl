#version 300 es

precision highp float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D previous;

out vec4 fragColor;

float pi = 3.14159265359;
float step = 2./255.;

void main() {
    vec2 st = gl_FragCoord.xy/resolution;
    vec2 mt = mouse/resolution;

    float vh = 1./resolution.y;
    float vw = 1./resolution.x;

    float d = pow(pow(mouse.x - gl_FragCoord.x, 2.) + pow(mouse.y - gl_FragCoord.y, 2.), 0.5);

    if (d < 10.) fragColor = vec4(sin(time), sin(time+pi*2./3.), sin(time+pi*4./3.), 1);
    else {
        vec4 last = texture(previous, st);
        vec4 s = texture(previous, (gl_FragCoord.xy + vec2(cos(time * 600.) * 4., sin(time * 600.) * 4.))/resolution);

        fragColor = vec4(
            max(last.r - step, s.r - step),
            max(last.g - step, s.g - step),
            max(last.b - step, s.b - step),
            1
        );

    }
}
