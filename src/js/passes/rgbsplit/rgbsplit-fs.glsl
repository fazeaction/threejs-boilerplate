in vec2 vUv;
out vec4 outColor;
uniform sampler2D tDiffuse;
uniform vec2 delta;
uniform vec2 resolution;

void main() {

  vec2 dir = vUv - vec2( .5 );
  float d = .7 * length( dir );
  normalize( dir );
  vec2 value = d * dir * delta;

  vec4 c1 = texture( tDiffuse, vUv - value / resolution.x );
  vec4 c2 = texture( tDiffuse, vUv );
  vec4 c3 = texture( tDiffuse, vUv + value / resolution.y );

  outColor = vec4( c1.r, c2.g, c3.b, c1.a + c2.a + c3.b );

}
