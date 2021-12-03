uniform float brightness;
uniform float contrast;
in vec2 vUv;
out vec4 outColor;
uniform sampler2D tDiffuse;

void main() {

  vec3 color = texture(tDiffuse, vUv).rgb;
  vec3 colorContrasted = (color) * contrast;
  vec3 bright = colorContrasted + vec3(brightness,brightness,brightness);
  outColor.rgb = bright;
  outColor.a = 1.;

}
