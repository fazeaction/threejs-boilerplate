// from https://github.com/mattdesl/lwjgl-basics/blob/master/test/res/shadertut/lesson3.frag

uniform sampler2D tDiffuse;
in vec2 vUv;
out vec4 outColor;

uniform vec3 color;
uniform float amount;

void main() {
  vec4 texColor = texture(tDiffuse, vUv);

  float gray = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));

  vec3 sepiaColor = vec3(gray) * color;

  texColor.rgb = mix(texColor.rgb, vec3(sepiaColor), amount);

  outColor = texColor;
}
