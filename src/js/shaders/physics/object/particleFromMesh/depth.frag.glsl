#version 300 es

precision highp float;
precision highp int;

in float texID;
in vec3 pos;
out vec4 outColor[2];

void main() {
    if (int(texID) == 0) {
        outColor[0] = vec4(pos, 1);
    } else if (int(texID) == 1) {
        outColor[1] = vec4(pos, 1);
    }
}
