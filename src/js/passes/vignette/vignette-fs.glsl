precision highp float;

uniform sampler2D tDiffuse;
uniform float reduction;
uniform float boost;

in vec2 vUv;
out vec4 outColor;

void main() {

  vec4 color = texture( tDiffuse, vUv );

  vec2 position = vUv - 0.5;
  float vignette = length(position);
  vignette = boost - vignette * reduction;

  color.rgb *= vignette;
  outColor = color;

}
