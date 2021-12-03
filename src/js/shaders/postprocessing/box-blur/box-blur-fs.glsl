// non-dependent texture read according to :
// http://xissburg.com/faster-gaussian-blur-in-glsl/

uniform sampler2D tInput;
uniform vec2 delta;
uniform vec2 resolution;
varying vec2 blurTexCoords[9];

void main() {

  vec4 sum = vec4( 0. );

  sum += texture2D( tInput, blurTexCoords[0] ) * 0.051;
  sum += texture2D( tInput, blurTexCoords[1] ) * 0.0918;
  sum += texture2D( tInput, blurTexCoords[2] ) * 0.12245;
  sum += texture2D( tInput, blurTexCoords[3] ) * 0.1531;
  sum += texture2D( tInput, blurTexCoords[4] ) * 0.1633;
  sum += texture2D( tInput, blurTexCoords[5] ) * 0.1531;
  sum += texture2D( tInput, blurTexCoords[6] ) * 0.12245;
  sum += texture2D( tInput, blurTexCoords[7] ) * 0.0918;
  sum += texture2D( tInput, blurTexCoords[8] ) * 0.051;

  gl_FragColor = sum;

}