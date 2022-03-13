in vec2 vUv;
out vec4 outColor;
uniform sampler2D tDiffuse;
uniform sampler2D tBias;
uniform float focalDistance;
uniform float aperture;
uniform vec2 delta;

float random(vec3 scale,float seed){return fract(sin(dot(gl_FragCoord.xyz+seed,scale))*43758.5453+seed);}

float unpack_depth(const in vec4 color) {
  return ( color.r * 256. * 256. * 256. + color.g * 256. * 256. + color.b * 256. + color.a ) / ( 256. * 256. * 256. );
}

float sampleBias( vec2 uv ) {
  float d = abs( texture( tBias, uv ).r - focalDistance );
  return min( d * aperture, .005 );
  //return unpack_depth( texture( tBias, uv ) );
}

void main() {

  vec4 sum = vec4( 0. );
  float bias = sampleBias( vUv );

  sum += texture( tDiffuse, ( vUv - bias * delta * 4. ) ) * 0.051;
  sum += texture( tDiffuse, ( vUv - bias * delta * 3. ) ) * 0.0918;
  sum += texture( tDiffuse, ( vUv - bias * delta * 2. ) ) * 0.12245;
  sum += texture( tDiffuse, ( vUv - bias * delta * 1. ) ) * 0.1531;
  sum += texture( tDiffuse, ( vUv + bias * delta * 0. ) ) * 0.1633;
  sum += texture( tDiffuse, ( vUv + bias * delta * 1. ) ) * 0.1531;
  sum += texture( tDiffuse, ( vUv + bias * delta * 2. ) ) * 0.12245;
  sum += texture( tDiffuse, ( vUv + bias * delta * 3. ) ) * 0.0918;
  sum += texture( tDiffuse, ( vUv + bias * delta * 4. ) ) * 0.051;

  outColor = sum;

}
