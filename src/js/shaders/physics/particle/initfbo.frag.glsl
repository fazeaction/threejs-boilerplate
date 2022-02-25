precision highp float;

uniform sampler2D u_posTex2;
uniform sampler2D u_velTex2;
uniform sampler2D u_forceTex2;
uniform sampler2D u_relPosTex2;

in vec2 v_uv;
out vec4 outColor[4];

void main() {
  // outColor = texture(u_posTex, v_uv);
  outColor[0] = texture(u_posTex2, v_uv);
  outColor[1] = texture(u_velTex2, v_uv);
  outColor[2] = texture(u_forceTex2, v_uv);
  outColor[3] = texture(u_relPosTex2, v_uv);
  // outColor[0] = texture(u_posTex, v_uv);
  // outColor[1] = texture(u_velTex, v_uv);
  // outColor[2] = texture(u_forceTex, v_uv);
  // outColor[3] = texture(u_relPosTex, v_uv);
}
