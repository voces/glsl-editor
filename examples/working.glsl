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

    // vec4 last = texture(previous, st);
    float d = pow(pow(mouse.x - gl_FragCoord.x, 2.) + pow(mouse.y - gl_FragCoord.y, 2.), 0.5);
    //float opacity = max(lastOpacity*0.99, nextOpacity);
    // float opacity = 0.2;

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
    //else if (fract((13.+st.x)*(17.+st.y)*(time/100.)/127.)<0.00001) c = 1.0;
    else if (neighbors == 2.) c = texture(previous, st).r;
    
    //vec3 color = vec3(
      //  c
        //last.r-1./255. + opacity*abs(sin(gl_FragCoord.x/100.+gl_FragCoord.y/200.+time)*0.5)*0.1,
        //last.g-1./255. + opacity*abs(sin(gl_FragCoord.x/300.-gl_FragCoord.y/400.+time)*0.6)*0.1,
        //last.b-1./255. + opacity*abs(sin(-gl_FragCoord.x/500.+gl_FragCoord.y/600.+time)*0.7)*0.1,

        // max(last.r-1./255., opacity*abs(sin(gl_FragCoord.x/100.+gl_FragCoord.y/200.+time)*0.5)),
        // max(last.g-2./255., opacity*abs(sin(gl_FragCoord.x/300.-gl_FragCoord.y/400.+time)*0.6)),
        // max(last.b-3./255., opacity*abs(sin(-gl_FragCoord.x/500.+gl_FragCoord.y/600.+time)*0.7)),

        // (1. - pow(pow(mt.x - st.x, 2.) + pow(mt.y - st.y, 2.), 0.5) - 0.99) * 100.
        // texture(previous, st.xy + vec2(0.005, 0)).r + texture(previous, st.xy + vec2(0.005, 0)).g * 0.96,
        // texture(previous, abs(st.xy + vec2(-0.005, 0))).r + texture(previous, abs(st.xy + vec2(-0.005, 0))).b * 0.98
        //max(1. - pow(pow(mouse.x - st.x, 2.) + pow(mouse.y - st.y, 2.), abs(sin(time*0.7+st.x*0.3+st.y)) * 0.5), 0.),
        //max(1. - pow(pow(mouse.x - st.x, 2.) + pow(mouse.y - st.y, 2.), abs(sin(time*0.8+st.x*0.6-st.y)) * 0.3), 0.)
    //);

    fragColor = vec4(vec3(c), 1.);
}
