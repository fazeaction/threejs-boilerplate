precision highp float;

uniform sampler2D u_posTex;
uniform sampler2D u_velTex;
uniform sampler2D u_forceTex;
uniform sampler2D u_relPosTex;

in vec2 v_uv;
out vec4 outColor[4];

void main() {
  // outColor = texture(u_posTex, v_uv);
  outColor[0] = texture(u_posTex, v_uv);
  outColor[1] = texture(u_velTex, v_uv);
  outColor[2] = texture(u_forceTex, v_uv);
  outColor[3] = texture(u_relPosTex, v_uv);
  // outColor[0] = texture(u_posTex, v_uv);
  // outColor[1] = texture(u_velTex, v_uv);
  // outColor[2] = texture(u_forceTex, v_uv);
  // outColor[3] = texture(u_relPosTex, v_uv);
}
