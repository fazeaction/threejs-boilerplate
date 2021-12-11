// non-dependent texture read according to :
// http://xissburg.com/faster-gaussian-blur-in-glsl/
in vec2 uv;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
in vec3 position;

uniform vec2 delta;
uniform vec2 resolution;

out vec2 blurTexCoords[9];

void main() {

  vec2 inc = delta / resolution;

  blurTexCoords[ 0 ] = uv - inc * 4.;
  blurTexCoords[ 1 ] = uv - inc * 3.;
  blurTexCoords[ 2 ] = uv - inc * 2.;
  blurTexCoords[ 3 ] = uv - inc * 1.;
  blurTexCoords[ 4 ] = uv;
  blurTexCoords[ 5 ] = uv + inc * 1.;
  blurTexCoords[ 6 ] = uv + inc * 2.;
  blurTexCoords[ 7 ] = uv + inc * 3.;
  blurTexCoords[ 8 ] = uv + inc * 4.;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

}
