#version 300 es

precision highp float;

uniform vec2 resolution;

#define MAXCOUNT 30
#define ESCAPERAD2 4.0
#define LOG2INV 1.4426950408889634
#define PI 3.14159265358979323846

out vec4 fragColor;

// Norm squared of a complex
float norm2(in vec2 z) {
    return dot(z, z);
}

// Smoothly shade.
float itershade(in vec2 c) {
    int max = MAXCOUNT;
    vec2 pt = vec2(0, 0);
    for (int count = 0; count < MAXCOUNT; count++) {
        if (norm2(pt) > ESCAPERAD2) {
            max = count;
            break;
        }
        pt = vec2(pt.x * pt.x - pt.y * pt.y, 2.0 * pt.x * pt.y) + c;
    }
    if (max == MAXCOUNT)
        return 0.0;
    float mu = float(max) - log(log(norm2(pt))) * LOG2INV;
    return 1.0 - mu / float(MAXCOUNT);
}

void main(void) {
    vec2 z = (gl_FragCoord.xy/resolution + vec2(-0.75, -0.5)) * 2.75;
    float shade = itershade(z);
    float offset = 1.5;
    vec3 angle = 2.0 * PI * (shade + vec3(0, 1, 2) / 3.0) + offset;
    fragColor = vec4((1.0 + cos(angle)) / 2.0, 1);
}