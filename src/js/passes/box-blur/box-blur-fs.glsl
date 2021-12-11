// non-dependent texture read according to :
// http://xissburg.com/faster-gaussian-blur-in-glsl/
precision highp float;

out vec4 outColor;
uniform sampler2D tDiffuse;
uniform vec2 delta;

in vec2 blurTexCoords[9];

void main() {

  vec4 sum = vec4( 0. );

  sum += texture( tDiffuse, blurTexCoords[0] ) * 0.051;
  sum += texture( tDiffuse, blurTexCoords[1] ) * 0.0918;
  sum += texture( tDiffuse, blurTexCoords[2] ) * 0.12245;
  sum += texture( tDiffuse, blurTexCoords[3] ) * 0.1531;
  sum += texture( tDiffuse, blurTexCoords[4] ) * 0.1633;
  sum += texture( tDiffuse, blurTexCoords[5] ) * 0.1531;
  sum += texture( tDiffuse, blurTexCoords[6] ) * 0.12245;
  sum += texture( tDiffuse, blurTexCoords[7] ) * 0.0918;
  sum += texture( tDiffuse, blurTexCoords[8] ) * 0.051;

  outColor = sum;

}
