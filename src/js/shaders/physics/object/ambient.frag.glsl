precision highp float;
precision highp int;

uniform vec3 u_lightCol;
uniform vec3 u_lightPos;
uniform float u_lightRad;
uniform sampler2D u_posTex;

in vec2 v_uv;
in vec3 v_position;
in vec3 v_normal;

out vec4 outColor;

vec3 applyNormalMap(vec3 geomnor, vec3 normap) {
    normap = normap * 2.0 - 1.0;
    vec3 up = normalize(vec3(0.001, 1, 0.001));
    vec3 surftan = normalize(cross(geomnor, up));
    vec3 surfbinor = cross(geomnor, surftan);
    return normap.y * surftan + normap.x * surfbinor + normap.z * geomnor;
}

void main() {

    outColor = vec4(v_normal, 1);  // TODO: perform lighting calculations
    gl_FragDepth  =  v_position.z * gl_FragCoord.w;
}
