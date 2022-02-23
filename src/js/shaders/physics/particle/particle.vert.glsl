precision highp float;
precision highp int;

uniform mat4 u_cameraMat;
uniform sampler2D u_posTex;
uniform int u_side;
uniform int u_bodySide;
uniform float u_diameter;
uniform float u_nearPlaneHeight;

// in float a_idx;

out vec4 v_eyePos;
out vec2 v_uv;
out float v_idx;

vec2 getUV(int idx, int side) {
    float v = float(idx / side) / float(side);
    float u = float(idx - (idx / side) * side) / float(side);
    return vec2(u, v) + (0.5 / float(u_side));
}

void main() {
    int idx = gl_VertexID;;

    vec2 uv = getUV(idx, u_side);
    vec3 pos = texture(u_posTex, uv).xyz;
//    vec3 pos = vec3(0.0, idx / 10.0, 0.0);

    v_uv = uv;
    v_idx = float(idx);
    v_eyePos = u_cameraMat * vec4(pos, 1.0);
    gl_Position = v_eyePos;
	gl_PointSize = (u_nearPlaneHeight * u_diameter) / gl_Position.w;
}
