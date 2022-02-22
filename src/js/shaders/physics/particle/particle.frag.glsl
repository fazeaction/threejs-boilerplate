#version 300 es

precision highp float;
precision highp int;

uniform mat4 u_cameraMat;
uniform vec3 u_cameraPos;
uniform float u_fovy;
uniform float u_diameter;
uniform sampler2D u_relPosTex;
uniform int u_side;

in vec4 v_eyePos;
in vec2 v_uv;
in float v_idx;
out vec4 outColor;

float rand(int f){
    vec2 co = vec2(float(f));
    return clamp(fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453), 0.1, 0.7);
}

vec2 getUV(int idx, int side) {
    float v = float(idx / side) / float(side);
    float u = float(idx - (idx / side) * side) / float(side);
    return vec2(u, v);
}

void main() {
    vec2 uv = 2.0 * gl_PointCoord - 1.0;
    if (length(uv) > 1.0) {
        discard;
    }
    vec3 normal = vec3(uv, -sqrt(1.0 - dot(uv, uv)));

    // The 15.0 is a hacky constant - it should be normal * radius
    // But was unsure about how to translate the radius value from world to eye space
    vec4 pixelPos = vec4(v_eyePos.xyz + normal * u_diameter / 15.0, 1.0);

    vec4 relPos = texture(u_relPosTex, v_uv);
    vec3 color;
    if (abs(relPos.w + 1.0) < 0.01) {
        color = vec3(0.0, 0.5, 0.7);
    }
    else if (abs(relPos.w) < 0.01 ) {
        color = vec3(0.3, 0.6, 0.0);
    }
    else {
        color = vec3(rand(int(relPos.w)), rand(int(relPos.w+1.0)), rand(int(relPos.w+2.0)));
    }
    vec3 diffuse = 0.1 + max(0.0, dot(normal, vec3(1.0, -1.0, -1.0))) * color;
    outColor = vec4(diffuse, 1);

    //gl_FragDepthEXT  =  pixelPos.z * gl_FragCoord.w;
    gl_FragDepth  =  pixelPos.z * gl_FragCoord.w;

}
