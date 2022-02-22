#version 300 es
precision highp float;
precision highp int;

uniform mat4 u_cameraMat;
uniform sampler2D u_posTex;

in vec3 a_position;
in vec3 a_normal;
in vec2 a_uv;

out vec3 v_position;
out vec3 v_normal;
out vec2 v_uv;

void main() {
    float scale = 0.2;
    vec4 texel = textureLod(u_posTex, vec2(0, 0), 0.0);
    vec4 new_pos = vec4(scale * a_position + texel.xyz, 1);

    gl_Position = u_cameraMat * new_pos;
    v_position = gl_Position.xyz;
//    v_position = a_position;
    v_normal = a_normal;
    v_uv = a_uv;
}
/*
void main()
{
    vec4 texel, newVertex;
    //Read the texture offset. Offset in the z direction only
    texel = textureLod(Texture0, inTexCoord, 0.0);
    newVertex = gl_Vertex;
    newVertex.z += texel.x;
    gl_Position = ProjectionModelviewMatrix * newVertex;
    TexCoord = inTexCoord;
}*/
