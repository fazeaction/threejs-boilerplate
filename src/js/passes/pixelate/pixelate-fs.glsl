in vec2 vUv;
out vec4 outColor;
uniform sampler2D tDiffuse;
uniform vec2 resolution;
uniform float amount;

void main() {

	float d = 1.0 / amount;
	float ar = resolution.x / resolution.y;
	float u = floor( vUv.x / d ) * d;
	d = ar / amount;
	float v = floor( vUv.y / d ) * d;
  outColor = texture( tDiffuse, vec2( u, v ) );

}
