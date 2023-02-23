#version 300 es

precision highp float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D previous;

out vec4 fragColor;

float pi = 3.14159265359;

void main() {
  vec2 st = gl_FragCoord.xy / resolution;
  vec2 mt = mouse / resolution;

  float vh = 1. / resolution.y;
  float vw = 1. / resolution.x;

  float d = pow(pow(mouse.x - gl_FragCoord.x, 2.) + pow(mouse.y - gl_FragCoord.y, 2.), 0.5);

  vec3 p = texture(previous, st).rgb;
  bool on = p.r > 0. || p.g > 0.;

  vec4 br = texture(previous, st + vec2(vw, vh));
  vec4 rr = texture(previous, st + vec2(vw, 0));
  vec4 ur = texture(previous, st + vec2(vw, -vh));
  vec4 bb = texture(previous, st + vec2(0, vh));
  vec4 uu = texture(previous, st + vec2(0, -vh));
  vec4 bl = texture(previous, st + vec2(-vw, vh));
  vec4 rl = texture(previous, st + vec2(-vw, 0));
  vec4 ul = texture(previous, st + vec2(-vw, -vh));

  float neighbors =
      ceil(max(br.r, br.g))
    + ceil(max(rr.r, rr.g))
    + ceil(max(ur.r, ur.g))
    + ceil(max(bb.r, bb.g))
    + ceil(max(uu.r, uu.g))
    + ceil(max(bl.r, bl.g))
    + ceil(max(rl.r, rl.g))
    + ceil(max(ul.r, ul.g));

  vec3 c = vec3(0., 0., 0.);

  if (neighbors == 3.) {
    if (on) c = p;
    else {
        float count = 0.;

        if (br.r > 0. || br.g > 0.) count++, c += br.rgb;
        if (rr.r > 0. || rr.g > 0.) count++, c += rr.rgb;
        if (ur.r > 0. || ur.g > 0.) count++, c += ur.rgb;
        if (bb.r > 0. || bb.g > 0.) count++, c += bb.rgb;
        if (uu.r > 0. || uu.g > 0.) count++, c += uu.rgb;
        if (bl.r > 0. || bl.g > 0.) count++, c += bl.rgb;
        if (rl.r > 0. || rl.g > 0.) count++, c += rl.rgb;
        if (ul.r > 0. || ul.g > 0.) count++, c += ul.rgb;

        c /= count;
    }
  } else if (d < 10.) c = vec3(sin(time) / 2. + 0.5, sin(time + pi * 2. / 3.) / 2. + 0.5, sin(time + pi * 4. / 3.) / 2. + 0.5);
  else if (neighbors == 2.) c = p;

  fragColor = vec4(c, 1.);
}
