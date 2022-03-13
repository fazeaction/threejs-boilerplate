precision highp float;

in vec2 vUv;
out vec4 outColor;
uniform sampler2D tDiffuse;

void main() {
  outColor = texture( tDiffuse, vUv );

}
