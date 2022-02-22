#version 300 es

precision highp float;
precision highp int;

uniform sampler2D u_tex0;
uniform sampler2D u_tex1;
uniform mat4 u_cameraMat;
uniform mat4 u_cameraMatInv;
uniform float u_gridSideLength;
uniform float u_gridTexSideLength;
uniform float u_gridWorldBounds;
uniform vec2 u_gridWorldLowerLeft;
// uniform float u_gridTexTileDimensions;

in vec2 v_uv;
out vec4 outColor;

vec3 voxelIndexFromUV(vec2 uv) {
    vec2 pixel = floor(uv * u_gridTexSideLength);
    float idx = pixel.x + pixel.y * u_gridTexSideLength;

    // NDC
    vec3 pos = vec3(mod(idx, u_gridSideLength),
                    mod(floor(idx / u_gridSideLength), u_gridSideLength),
                    floor(idx / pow(u_gridSideLength, 2.)));

    pos = pos / u_gridSideLength;
    pos = pos * u_gridWorldBounds;
    pos = pos + vec3(u_gridWorldLowerLeft, -u_gridWorldBounds * .5);
    // Add small vector in order to align to pixel centers in depth textures
    // I think... D:
    pos = pos + (u_gridWorldBounds * .5 / u_gridSideLength);
    return pos;
}

void main() {
    vec3 voxelIdx = voxelIndexFromUV(v_uv);
    vec2 voxelUV = (u_cameraMat * vec4(voxelIdx, 1)).xy;
    voxelUV = .5 * (voxelUV + 1.);
    // Align to pixel centers
    voxelUV = voxelUV * u_gridTexSideLength;
    voxelUV = floor(voxelUV) - .5;
    voxelUV = voxelUV / u_gridTexSideLength;

    //gl_FragColor = vec4(voxelUV, 0, 1.);
    vec3 voxelPos = texture(u_tex0, voxelUV).xyz;
    //gl_FragColor = vec4(voxelPos.zzz * -10., 1.);
    // if (abs(voxelIdx.x - voxelPos.x) < .1) {
    //     gl_FragColor = vec4(0, 1, 0, 1);
    // } else {
    //     gl_FragColor = vec4(1, 0, 0, 1);
    // }
    float tex0Depth = texture(u_tex0, voxelUV).z;
    float tex1Depth = texture(u_tex1, voxelUV).z;

    if (voxelIdx.z < tex0Depth && voxelIdx.z > tex1Depth) {
        outColor = vec4(1, 0, 0, 0);
    } else {
        outColor = vec4(0, 0, 0, 0);
    }
}
